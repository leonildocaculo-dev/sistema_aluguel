<?php

namespace App\Channels;

use App\Contracts\NotificationChannelInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppChannel implements NotificationChannelInterface
{
    public function send(string $to, string $message, array $data = []): bool
    {
        // Variáveis retiradas do .env
        $apiUrl = config('services.whatsapp.url');
        $token = config('services.whatsapp.token');

        if (!$apiUrl || !$token) {
            Log::warning("WhatsAppChannel: API ou Token não configurados no .env. Simulação do envio para: {$to}");
            return true; // Simulação de sucesso em ambiente local sem API definida
        }

        try {
            // Este payload genérico foi desenhado para suportar a Cloud API da Meta (versão gratuita de testes)
            // Caso decida usar uma API como EvolutionAPI/Z-API, bastará alterar este payload no futuro.
            $response = Http::withToken($token)
                ->post($apiUrl, [
                    'messaging_product' => 'whatsapp',
                    'to' => $to,
                    'type' => 'text',
                    'text' => [
                        'body' => $message
                    ]
                ]);

            if ($response->successful()) {
                return true;
            }

            Log::error("Falha ao enviar WhatsApp para {$to}: " . $response->body());
            return false;

        } catch (\Exception $e) {
            Log::error("Erro Crítico ao conectar API do WhatsApp: " . $e->getMessage());
            return false;
        }
    }
}
