<?php

namespace App\Gateways;

use App\Contracts\PaymentGatewayInterface;
use App\Models\Reservation;
use App\Models\PaymentIntent;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class ProxyPayGateway implements PaymentGatewayInterface
{
    public function createIntent(Reservation $reservation, float $amount): PaymentIntent
    {
        if (!config('features.payments.proxypay', true)) {
            throw new \Exception('O gateway ProxyPay encontra-se temporariamente desativado.');
        }

        $apiUrl = config('payments.proxypay.url');
        $apiKey = config('payments.proxypay.api_key');
        
        // Gerar referência de 9 dígitos
        $reference = rand(100000000, 999999999);
        $expiresAt = now()->addHours(2);

        if (!empty($apiKey)) {
            $response = Http::timeout(config('payments.proxypay.timeout', 5))
                ->retry(
                    config('payments.proxypay.retries', 3), 
                    config('payments.proxypay.retry_delay', 100)
                )
                ->withToken($apiKey)
                ->withHeaders(['Accept' => 'application/vnd.proxypay.v2+json'])
                ->put("{$apiUrl}/references/{$reference}", [
                    'amount' => $amount,
                    'end_datetime' => $expiresAt->format('Y-m-d\TH:i:s\Z'),
                    'custom_fields' => [
                        'reservation_id' => (string) $reservation->id
                    ]
                ]);

            if ($response->failed()) {
                Log::error('Erro Proxypay: ' . $response->body());
                throw new \Exception('Gateway de pagamento temporariamente indisponível.');
            }
        }

        return PaymentIntent::create([
            'reservation_id' => $reservation->id,
            'gateway' => 'proxypay',
            'amount' => $amount,
            'gateway_reference' => (string) $reference,
            'status' => 'pending',
            'expires_at' => $expiresAt,
        ]);
    }

    public function verifyWebhookSignature(array $payload, string $signature): bool
    {
        $secret = config('payments.proxypay.webhook_secret', '');
        if (empty($secret)) {
            return true; // Se não houver segredo (desenvolvimento), aceita
        }

        $computed = hash_hmac('sha256', json_encode($payload), $secret);
        return hash_equals($computed, $signature);
    }

    public function extractEventId(array $payload): string
    {
        return $payload['id'] ?? Str::uuid()->toString();
    }

    public function checkStatus(PaymentIntent $intent): string
    {
        $apiUrl = config('payments.proxypay.url');
        $apiKey = config('payments.proxypay.api_key');

        if (empty($apiKey) || !config('features.payments.proxypay', true)) return 'pending';

        try {
            $response = Http::timeout(config('payments.proxypay.timeout', 5))
                ->retry(
                    config('payments.proxypay.retries', 3), 
                    config('payments.proxypay.retry_delay', 100)
                )
                ->withToken($apiKey)
                ->withHeaders(['Accept' => 'application/vnd.proxypay.v2+json'])
                ->get("{$apiUrl}/payments", [
                    'reference' => $intent->gateway_reference
                ]);

            if ($response->successful() && !empty($response->json('data'))) {
                return 'succeeded';
            }
        } catch (\Exception $e) {
            Log::error('Erro Proxypay CheckStatus: ' . $e->getMessage());
        }

        return 'pending';
    }
}
