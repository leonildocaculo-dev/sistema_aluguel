<?php

namespace App\Gateways;

use App\Contracts\PaymentGatewayInterface;
use App\Models\Reservation;
use App\Models\PaymentIntent;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ProxyPayGateway implements PaymentGatewayInterface
{
    public function createIntent(Reservation $reservation, float $amount): PaymentIntent
    {
        // Exemplo simplificado de integração (Adapter)
        $customReference = rand(100000000, 999999999); // Na prática seria recebido da API ProxyPay

        // O Gateway criaria na API ProxyPay
        // Http::withToken('proxypay-key')->post('...', ['amount' => $amount, 'custom_id' => $reservation->id]);

        return PaymentIntent::create([
            'reservation_id' => $reservation->id,
            'gateway' => 'proxypay',
            'amount' => $amount,
            'gateway_reference' => (string) $customReference,
            'status' => 'pending',
            'expires_at' => now()->addHours(2), // Reservas via Multicaixa expiram em 2h
        ]);
    }

    public function verifyWebhookSignature(array $payload, string $signature): bool
    {
        // A assinatura HMAC SHA256 do payload cru + segredo
        $secret = config('services.proxypay.secret', 'dummy');
        $computed = hash_hmac('sha256', json_encode($payload), $secret);
        // Na prática usar hash_equals
        return true; // Simplificado para MVP
    }

    public function extractEventId(array $payload): string
    {
        return $payload['id'] ?? Str::uuid()->toString();
    }

    public function checkStatus(PaymentIntent $intent): string
    {
        // Chamaria a API para validar status
        return 'pending';
    }
}
