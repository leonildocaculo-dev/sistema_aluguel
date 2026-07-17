<?php

namespace App\Http\Controllers;

use App\Models\KycVerification;
use App\Mail\KycRejectedMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\Kyc\UploadKycRequest;

class KycVerificationController extends Controller
{
    // PROPRIETÁRIO: Submeter documento
    public function uploadDocument(UploadKycRequest $request)
    {
        $user = $request->user();

        // Se já tem pendente ou aprovado, não permite
        $existing = $user->kycVerification;
        if ($existing && in_array($existing->status, ['pending', 'approved'])) {
            return response()->json(['message' => 'Já possui um processo de KYC pendente ou aprovado.'], 400);
        }

        $file = $request->file('document');
        $filename = \Illuminate\Support\Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('kyc/' . $user->id, $filename, 's3');
        $fullUrl = Storage::disk('s3')->url($path);

        if ($existing) {
            $existing->update([
                'document_type' => $request->document_type,
                'document_path' => $fullUrl,
                'status' => 'pending',
                'admin_notes' => null,
            ]);
            $kyc = $existing;
        } else {
            $kyc = KycVerification::create([
                'user_id' => $user->id,
                'document_type' => $request->document_type,
                'document_path' => $fullUrl,
                'status' => 'pending',
            ]);
        }

        return response()->json(['message' => 'Documento submetido. Aguarda validação administrativa.', 'kyc' => $kyc]);
    }

    // PROPRIETÁRIO: Ver estado atual
    public function checkStatus(Request $request)
    {
        $kyc = $request->user()->kycVerification;
        return response()->json([
            'status' => $kyc ? $kyc->status : 'none',
            'admin_notes' => $kyc ? $kyc->admin_notes : null,
            'document_type' => $kyc ? $kyc->document_type : null,
        ]);
    }

    // ADMIN: Listar Pendentes
    public function pendingKyc()
    {
        $kycs = KycVerification::with('user')->where('status', 'pending')->paginate(20);
        return response()->json($kycs);
    }

    // ADMIN: Aprovar
    public function approveKyc(Request $request, $id)
    {
        $kyc = KycVerification::where('status', 'pending')->findOrFail($id);
        
        $kyc->update([
            'status' => 'approved',
            'verified_by' => $request->user()->id,
            'verified_at' => now()
        ]);

        return response()->json(['message' => 'KYC Aprovado com sucesso. O Proprietário já pode listar alojamentos.']);
    }

    // ADMIN: Rejeitar
    public function rejectKyc(Request $request, $id)
    {
        $request->validate([
            'admin_notes' => 'required|string|max:500'
        ]);

        $kyc = KycVerification::with('user')->where('status', 'pending')->findOrFail($id);
        
        $kyc->update([
            'status' => 'rejected',
            'admin_notes' => $request->admin_notes,
            'verified_by' => $request->user()->id,
            'verified_at' => now()
        ]);

        // Enviar email notificando a rejeição
        Mail::to($kyc->user->email)->send(new KycRejectedMail($kyc->user->name, $request->admin_notes));

        return response()->json(['message' => 'KYC Rejeitado e Proprietário notificado por email.']);
    }
}
