<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Reservation;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Http\Requests\Payment\UploadComprovativoRequest;
use App\Services\PaymentService;

class PaymentController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }
    // Cliente: Upload de comprovativo de transferência
    public function uploadComprovativo(UploadComprovativoRequest $request, $reservationId)
    {
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
        $this->paymentService->approveManualPayment($id, $request->user());
        return response()->json(['message' => 'Pagamento e Reserva confirmados com sucesso.']);
    }

    // Admin: Rejeitar Pagamento
    public function reject(Request $request, $id)
    {
        $this->paymentService->rejectManualPayment($id, $request->user());
        return response()->json(['message' => 'Pagamento rejeitado e reserva cancelada.']);
    }
}
