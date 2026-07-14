<?php

namespace App\Listeners;

use App\Events\PaymentConfirmed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Jobs\GenerateCommissionJob;

class UpdateReservationStatus implements ShouldQueue
{
    /**
     * Ouve o evento PaymentConfirmed e actualiza a reserva e dispara a comissão.
     */
    public function handle(PaymentConfirmed $event): void
    {
        $reservation = $event->intent->reservation;

        if ($reservation && $reservation->status !== 'confirmed') {
            $reservation->update(['status' => 'confirmed']);
            
            // Disparar o Job para calcular comissões de forma assíncrona
            dispatch(new GenerateCommissionJob($event->intent));

            // Disparar Notificações WhatsApp Assíncronas
            $clientMessage = "Olá {$reservation->user->name}, o seu pagamento de {$reservation->total_price}Kz foi confirmado. A sua reserva em AngolaStay está garantida!";
            // Assumindo que o utilizador tem campo phone
            if (!empty($reservation->user->phone)) {
                dispatch(new \App\Jobs\SendWhatsAppMessageJob($reservation->user->phone, $clientMessage));
            }
        }
    }
}
