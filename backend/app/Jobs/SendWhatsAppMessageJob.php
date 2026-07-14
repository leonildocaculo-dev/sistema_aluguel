<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Services\NotificationService;
use Exception;

class SendWhatsAppMessageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * O número de vezes que o job pode ser tentado caso falhe.
     */
    public $tries = 3;

    public function __construct(
        public string $to,
        public string $message
    ) {
    }

    /**
     * Executa o envio assíncrono.
     */
    public function handle(NotificationService $notificationService): void
    {
        $success = $notificationService->sendWhatsAppMessage($this->to, $this->message);

        if (!$success) {
            throw new Exception("Falha no envio da notificação WhatsApp para {$this->to}");
        }
    }
}
