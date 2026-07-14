<?php

namespace App\Gateways;

use App\Contracts\PaymentGatewayInterface;
use App\Models\Reservation;
use App\Models\PaymentIntent;
use Illuminate\Support\Str;

class ManualTransferGateway implements PaymentGatewayInterface
{
    public function createIntent(Reservation $reservation, float $amount): PaymentIntent
    {
        return PaymentIntent::create([
            'reservation_id' => $reservation->id,
            'gateway' => 'manual',
            'amount' => $amount,
            'status' => 'pending',
            'expires_at' => now()->addHours(24), // Transferência manual dá 24h ao cliente
        ]);
    }

    public function verifyWebhookSignature(array $payload, string $signature): bool
    {
        // Transferência manual não tem webhook automatizado
        return false;
    }

    public function extractEventId(array $payload): string
    {
        return Str::uuid()->toString();
    }

    public function checkStatus(PaymentIntent $intent): string
    {
        return $intent->status;
    }
}
