<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PaymentWebhookService;

class WebhookController extends Controller
{
    /**
     * Endpoint universal para recepção de webhooks de múltiplos gateways.
     */
    public function handle(Request $request, string $gateway, PaymentWebhookService $webhookService)
    {
        // Os provedores enviam assinaturas em diferentes headers.
        // Como simplificação, pegamos do X-Signature ou HTTP_X_SIGNATURE
        $signature = $request->header('X-Signature', $request->header('Signature', ''));

        try {
            $webhookService->handleWebhook($gateway, $request->all(), $signature);
            return response()->json(['status' => 'success'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Endpoint de Teste (MOCK) para forçar o sucesso de um pagamento.
     * Útil para o MVP quando os gateways não estão implementados.
     */
    public function mock(Request $request)
    {
        $reservationId = $request->input('reservation_id');
        if (!$reservationId) {
            return response()->json(['error' => 'reservation_id is required'], 400);
        }

        $reservation = \App\Models\Reservation::find($reservationId);
        if (!$reservation) {
            return response()->json(['error' => 'Reservation not found'], 404);
        }

        $reservation->update(['status' => 'confirmed']);
        
        // Se houver um intent associado, marcar como succeeded
        if ($reservation->payment_intent_id) {
            $intent = \App\Models\PaymentIntent::find($reservation->payment_intent_id);
            if ($intent) $intent->update(['status' => 'succeeded']);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Pagamento confirmado manualmente (Mock)'
        ]);
    }
}
