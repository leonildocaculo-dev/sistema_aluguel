<?php

namespace App\Contracts;

use App\Models\Reservation;
use App\Models\PaymentIntent;

interface PaymentGatewayInterface
{
    /**
     * Inicia o processo de pagamento (ex: gera referência ou devolve URL do iframe).
     */
    public function createIntent(Reservation $reservation, float $amount): PaymentIntent;

    /**
     * Valida um webhook recebido do provedor.
     * Deve atirar excepção caso a assinatura seja inválida.
     */
    public function verifyWebhookSignature(array $payload, string $signature): bool;

    /**
     * Extrai a identificação única do evento do webhook para idempotência.
     */
    public function extractEventId(array $payload): string;

    /**
     * Verifica directamente na API do banco o estado actual do pagamento.
     */
    public function checkStatus(PaymentIntent $intent): string;
}
