<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\Availability;

class ReleaseAvailability implements ShouldQueue
{
    /**
     * Ouve os eventos PaymentRejected e PaymentExpired.
     * Deve libertar os dias no calendário.
     */
    public function handle(object $event): void
    {
        $reservation = $event->intent->reservation;

        if ($reservation) {
            $reservation->update(['status' => 'cancelled']);
            
            // Libertar as datas na BD
            Availability::where('reservation_id', $reservation->id)->delete();

            // Notificar Cliente da Expiração
            $clientMessage = "Lamentamos {$reservation->user->name}, a sua intenção de reserva no AngolaStay expirou por falta de pagamento. As datas foram libertadas.";
            if (!empty($reservation->user->phone)) {
                dispatch(new \App\Jobs\SendWhatsAppMessageJob($reservation->user->phone, $clientMessage));
            }
        }
    }
}
