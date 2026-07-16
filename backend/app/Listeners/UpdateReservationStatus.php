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

        // O schema DB usa 'confirmado', não 'confirmed'
        if ($reservation && $reservation->status !== 'confirmado') {
            $reservation->update(['status' => 'confirmado']);
            
            // Disparar Notificação por Email (Laravel Notifications)
            $reservation->user->notify(new \App\Notifications\ReservationStatusNotification($reservation, 'confirmado'));

            // Disparar o Job para calcular comissões de forma assíncrona
            dispatch(new GenerateCommissionJob($event->intent));

            // Disparar Notificações WhatsApp Assíncronas (se houver telefone)
            $clientMessage = "Olá {$reservation->user->name}, o seu pagamento de {$reservation->total_price}Kz foi confirmado. A sua reserva em AngolaStay está garantida!";
            if (!empty($reservation->user->phone)) {
                dispatch(new \App\Jobs\SendWhatsAppMessageJob($reservation->user->phone, $clientMessage));
            }
        }
    }
}
