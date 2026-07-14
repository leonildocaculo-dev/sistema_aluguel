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
            // Em caso de erro de idempotência ou assinatura, retornamos 400 Bad Request
            // Retornar 200 numa excepção de assinatura seria um risco (o provider pensaria que estava OK)
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
