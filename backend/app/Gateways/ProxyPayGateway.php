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
        $apiUrl = config('services.proxypay.url', 'https://api.sandbox.proxypay.co.ao');
        $apiKey = config('services.proxypay.key', '');
        
        // Gerar referência de 9 dígitos
        $reference = rand(100000000, 999999999);
        $expiresAt = now()->addHours(2);

        if (!empty($apiKey)) {
            $response = Http::withToken($apiKey)
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
                throw new \Exception('Erro ao comunicar com a ProxyPay.');
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
        $secret = config('services.proxypay.secret', '');
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
        $apiUrl = config('services.proxypay.url', 'https://api.sandbox.proxypay.co.ao');
        $apiKey = config('services.proxypay.key', '');

        if (empty($apiKey)) return 'pending';

        $response = Http::withToken($apiKey)
            ->withHeaders(['Accept' => 'application/vnd.proxypay.v2+json'])
            ->get("{$apiUrl}/payments", [
                'reference' => $intent->gateway_reference
            ]);

        if ($response->successful() && !empty($response->json('data'))) {
            return 'succeeded';
        }

        return 'pending';
    }
}
