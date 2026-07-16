<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Reservation;

class ReservationStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $reservation;
    protected $status;

    /**
     * Create a new notification instance.
     */
    public function __construct(Reservation $reservation, string $status)
    {
        $this->reservation = $reservation;
        $this->status = $status;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        // For future: add 'nexmo' or 'twilio' for SMS
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $statusMsg = $this->status === 'confirmado' ? 'O seu pagamento foi confirmado!' : 'A sua reserva foi cancelada/rejeitada.';
        
        // Accommodation relation might not be eager loaded if queued, handle gracefully
        $propertyName = 'Alojamento';
        if ($this->reservation->relationLoaded('accommodation') && $this->reservation->accommodation->relationLoaded('property')) {
            $propertyName = $this->reservation->accommodation->property->name ?? 'Alojamento';
        }

        return (new MailMessage)
                    ->subject("Estado da Reserva: $statusMsg - AngolaStay")
                    ->greeting("Olá, {$notifiable->name}!")
                    ->line("O estado da sua encomenda para $propertyName foi atualizado.")
                    ->line("Novo estado: " . strtoupper($this->status))
                    ->line("Detalhes: Check-in: {$this->reservation->check_in} | Tipo: {$this->reservation->booking_type}")
                    ->action('Ver a Minha Reserva', url('/dashboard/reservas'))
                    ->line('Obrigado por utilizar a AngolaStay!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'reservation_id' => $this->reservation->id,
            'status' => $this->status
        ];
    }
}
