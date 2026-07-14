<?php

namespace App\Contracts;

interface NotificationChannelInterface
{
    /**
     * Envia uma notificação genérica.
     * 
     * @param string $to O destinatário (ex: número de telefone).
     * @param string $message O corpo da mensagem ou ID do Template.
     * @param array $data Dados extra (ex: variáveis do template).
     * @return bool
     */
    public function send(string $to, string $message, array $data = []): bool;
}
