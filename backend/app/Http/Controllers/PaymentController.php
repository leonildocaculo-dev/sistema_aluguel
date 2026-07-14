<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Reservation;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    // Cliente: Upload de comprovativo de transferência
    public function uploadComprovativo(Request $request, $reservationId)
    {
        $request->validate([
            'comprovativo' => 'required|file|mimes:jpeg,png,jpg,pdf|max:5120', // max 5MB, MIME types reais validados
        ]);

        $reservation = $request->user()->reservations()->findOrFail($reservationId);

        if ($reservation->status !== 'pendente_pagamento') {
            return response()->json(['message' => 'Reserva não está pendente de pagamento.'], 400);
        }

        DB::beginTransaction();
        try {
            // Upload to S3/Cloudflare R2
            $path = $request->file('comprovativo')->store('comprovativos/' . $reservation->id, 's3');
            $fullUrl = Storage::disk('s3')->url($path);

            $payment = Payment::create([
                'reservation_id' => $reservation->id,
                'metodo' => 'transferencia',
                'valor' => $reservation->total_price,
                'comprovativo_path' => $fullUrl,
                'estado' => 'aguarda_validação',
                'idempotency_key' => Str::uuid()->toString(),
            ]);

            // Actualizar a reserva
            $reservation->update(['status' => 'aguarda_validação']);

            DB::commit();

            return response()->json(['message' => 'Comprovativo enviado. Aguarda validação administrativa.', 'payment' => $payment]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erro ao processar comprovativo.', 'error' => $e->getMessage()], 500);
        }
    }

    // Admin: Listar pagamentos pendentes de validação
    public function pendingApprovals()
    {
        $payments = Payment::with('reservation.user', 'reservation.accommodation')
            ->where('estado', 'aguarda_validação')
            ->orderBy('created_at', 'asc')
            ->paginate(20);

        return response()->json($payments);
    }

    // Admin: Aprovar Pagamento
    public function approve(Request $request, $id)
    {
        $payment = Payment::where('estado', 'aguarda_validação')->findOrFail($id);

        DB::transaction(function () use ($payment, $request) {
            $payment->update([
                'estado' => 'confirmado',
                'validado_por' => $request->user()->id,
                'data_pagamento' => now(),
            ]);

            $payment->reservation->update(['status' => 'confirmado']);

            // Criar Log de Auditoria
            AuditLog::create([
                'user_id' => $request->user()->id,
                'action' => 'approved_payment',
                'model_type' => Payment::class,
                'model_id' => $payment->id,
                'new_values' => ['estado' => 'confirmado'],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        });

        return response()->json(['message' => 'Pagamento e Reserva confirmados com sucesso.']);
    }

    // Admin: Rejeitar Pagamento
    public function reject(Request $request, $id)
    {
        $payment = Payment::where('estado', 'aguarda_validação')->findOrFail($id);

        DB::transaction(function () use ($payment, $request) {
            $payment->update([
                'estado' => 'rejeitado',
                'validado_por' => $request->user()->id,
            ]);

            $payment->reservation->update(['status' => 'rejeitado']);
            // A disponibilidade é libertada quando a reserva é rejeitada (não bloqueado por trigger neste MVP, mas na prática remove-se o Availability correspondente)
            $payment->reservation->availability()->delete();

            AuditLog::create([
                'user_id' => $request->user()->id,
                'action' => 'rejected_payment',
                'model_type' => Payment::class,
                'model_id' => $payment->id,
                'new_values' => ['estado' => 'rejeitado'],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        });

        return response()->json(['message' => 'Pagamento rejeitado e reserva cancelada.']);
    }
}
