<?php

namespace App\Gateways;

use App\Contracts\PaymentGatewayInterface;
use App\Models\Reservation;
use App\Models\PaymentIntent;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GpoIframeGateway implements PaymentGatewayInterface
{
    public function createIntent(Reservation $reservation, float $amount): PaymentIntent
    {
        if (!config('features.payments.gpo', true)) {
            throw new \Exception('O gateway GPO encontra-se temporariamente desativado.');
        }

        $apiUrl = config('payments.gpo.url');
        $apiKey = config('payments.gpo.api_key');
        
        $sessionId = Str::uuid()->toString();
        $iframeUrl = "{$apiUrl}/widget?session=" . $sessionId; // Default simulação

        if (!empty($apiKey)) {
            $response = Http::timeout(config('payments.gpo.timeout', 5))
                ->retry(
                    config('payments.gpo.retries', 3), 
                    config('payments.gpo.retry_delay', 100)
                )
                ->withToken($apiKey)
                ->post("{$apiUrl}/sessions", [
                    'amount' => $amount,
                    'reference' => (string) $reservation->id,
                    'success_url' => route('frontend.checkout.success', ['id' => $reservation->id]), // Exemplo
                    'cancel_url' => route('frontend.checkout.cancel', ['id' => $reservation->id])
                ]);

            if ($response->successful() && $response->json('session_id')) {
                $sessionId = $response->json('session_id');
                $iframeUrl = $response->json('iframe_url') ?? "{$apiUrl}/widget?session={$sessionId}";
            } else {
                Log::error('Erro GPO: ' . $response->body());
                throw new \Exception('Gateway de pagamento temporariamente indisponível.');
            }
        }

        return PaymentIntent::create([
            'reservation_id' => $reservation->id,
            'gateway' => 'gpo_iframe',
            'amount' => $amount,
            'gateway_reference' => $sessionId,
            'gateway_response' => ['iframe_url' => $iframeUrl],
            'status' => 'pending',
            'expires_at' => now()->addHours(1), // Iframe expira mais rápido (tempo de sessão)
        ]);
    }

    public function verifyWebhookSignature(array $payload, string $signature): bool
    {
        $secret = config('payments.gpo.webhook_secret', '');
        if (empty($secret)) {
            return true; // Desenvolvimento
        }

        // Exemplo genérico de assinatura (depende da doc oficial da GPO)
        $computed = hash_hmac('sha256', json_encode($payload), $secret);
        return hash_equals($computed, $signature);
    }

    public function extractEventId(array $payload): string
    {
        return $payload['transaction_id'] ?? Str::uuid()->toString();
    }

    public function checkStatus(PaymentIntent $intent): string
    {
        $apiUrl = config('payments.gpo.url');
        $apiKey = config('payments.gpo.api_key');

        if (empty($apiKey) || !config('features.payments.gpo', true)) return 'pending';

        try {
            $response = Http::timeout(config('payments.gpo.timeout', 5))
                ->retry(
                    config('payments.gpo.retries', 3), 
                    config('payments.gpo.retry_delay', 100)
                )
                ->withToken($apiKey)
                ->get("{$apiUrl}/sessions/{$intent->gateway_reference}/status");

            if ($response->successful() && $response->json('status') === 'PAID') {
                return 'succeeded';
            }
        } catch (\Exception $e) {
            Log::error('Erro GPO CheckStatus: ' . $e->getMessage());
        }

        return 'pending';
    }
}
