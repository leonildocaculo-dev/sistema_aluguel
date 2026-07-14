<?php

namespace App\Gateways;

use App\Contracts\PaymentGatewayInterface;
use App\Models\Reservation;
use App\Models\PaymentIntent;
use Illuminate\Support\Str;

class GpoIframeGateway implements PaymentGatewayInterface
{
    public function createIntent(Reservation $reservation, float $amount): PaymentIntent
    {
        // GPO fornece um ID de sessão para inicializar o Iframe
        $sessionId = Str::uuid()->toString(); // Simulação

        return PaymentIntent::create([
            'reservation_id' => $reservation->id,
            'gateway' => 'gpo_iframe',
            'amount' => $amount,
            'gateway_reference' => $sessionId,
            'gateway_response' => ['iframe_url' => 'https://sandbox.gpo.co.ao/widget?session=' . $sessionId],
            'status' => 'pending',
            'expires_at' => now()->addHours(1), // Iframe expira mais rápido (tempo de sessão)
        ]);
    }

    public function verifyWebhookSignature(array $payload, string $signature): bool
    {
        return true;
    }

    public function extractEventId(array $payload): string
    {
        return $payload['transaction_id'] ?? Str::uuid()->toString();
    }

    public function checkStatus(PaymentIntent $intent): string
    {
        return 'pending';
    }
}
