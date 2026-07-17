<?php

namespace App\Services;

use App\Models\PaymentWebhookLog;
use App\Models\PaymentIntent;
use App\Events\PaymentConfirmed;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Redis;
use InvalidArgumentException;
use Exception;

class PaymentWebhookService
{
    /**
     * Processa o callback com idempotência (Redis Lock) e segurança.
     */
    public function handleWebhook(string $gatewayName, array $payload, string $signature): void
    {
        try {
            $gateway = App::make('gateway.' . $gatewayName);
        } catch (\Exception $e) {
            throw new InvalidArgumentException("Gateway não suportado: {$gatewayName}");
        }

        // 1. Criar Log Imutável
        $log = PaymentWebhookLog::create([
            'gateway' => $gatewayName,
            'payload' => $payload,
        ]);

        // 2. Verificar Assinatura (Segurança)
        if (!$gateway->verifyWebhookSignature($payload, $signature)) {
            $log->update(['processing_error' => 'Assinatura inválida']);
            throw new Exception("Assinatura inválida no Webhook do gateway {$gatewayName}.");
        }
        $log->update(['is_verified' => true]);

        // 3. Extrair ID Único do Evento para Idempotência
        $eventId = $gateway->extractEventId($payload);
        $lockKey = "webhook_lock:{$gatewayName}:{$eventId}";

        // 4. Garantir Idempotência (Bloqueio Redis por 5 min)
        $lock = Redis::set($lockKey, true, 'EX', 300, 'NX');
        
        if (!$lock) {
            $log->update(['processing_error' => 'Evento duplicado/em processamento (Idempotência).']);
            return; // Já foi processado ou está a ser
        }

        try {
            // Processar a Lógica
            $reference = $payload['reference'] ?? null; // Simplificação
            $intent = PaymentIntent::where('gateway_reference', $reference)->first();

            if ($intent && $intent->status !== 'succeeded') {
                $intent->update(['status' => 'succeeded']);
                // Gerar Fatura/Recibo Automaticamente
                $invoiceService = app(\App\Services\InvoiceService::class);
                $invoiceService->generateForReservation($intent->reservation, $intent->amount);
                
                // Disparar Evento
                event(new PaymentConfirmed($intent));
            }

            $log->update(['is_processed' => true]);
        } catch (\Exception $e) {
            $log->update(['processing_error' => $e->getMessage()]);
            // Libertar lock em caso de erro para permitir retry
            Redis::del($lockKey);
            throw $e;
        }
    }
}
