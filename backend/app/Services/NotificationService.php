<?php

namespace App\Services;

use App\Contracts\NotificationChannelInterface;

class NotificationService
{
    protected $channel;

    public function __construct(NotificationChannelInterface $channel)
    {
        $this->channel = $channel;
    }

    /**
     * Envia uma mensagem genérica de WhatsApp.
     */
    public function sendWhatsAppMessage(string $to, string $message): bool
    {
        // Pode aplicar formatação ao número (ex: adicionar +244 se não existir)
        $formattedTo = $this->formatPhoneNumber($to);
        
        return $this->channel->send($formattedTo, $message);
    }

    private function formatPhoneNumber(string $phone): string
    {
        // Se for um número angolano que começa por 9, formata para formato internacional
        if (preg_match('/^9\d{8}$/', $phone)) {
            return '+244' . $phone;
        }
        return $phone;
    }
}
