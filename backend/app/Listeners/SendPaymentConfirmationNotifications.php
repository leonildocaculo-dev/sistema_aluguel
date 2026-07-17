<?php

namespace App\Listeners;

use App\Events\PaymentConfirmed;
use App\Mail\PaymentConfirmedClientMail;
use App\Mail\PaymentConfirmedAdminMail;
use App\Models\Invoice;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendPaymentConfirmationNotifications implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(PaymentConfirmed $event): void
    {
        try {
            $intent = $event->paymentIntent;
            $reservation = $intent->reservation;
            
            // Tenta localizar a fatura gerada para este pagamento
            $invoice = Invoice::where('reservation_id', $reservation->id)->first();

            if (!$invoice) {
                Log::warning("Não foi encontrada Fatura para a reserva {$reservation->id}. Abortando envio de recibo.");
                return;
            }

            // Enviar email para o Cliente
            if ($reservation->user && $reservation->user->email) {
                Mail::to($reservation->user->email)
                    ->send(new PaymentConfirmedClientMail($reservation, $invoice));
            }

            // Enviar email interno para Administradores da plataforma (exemplo: admin@angolastay.com)
            // Futuramente pode ser extraído de config('mail.admin_address')
            Mail::to('admin@angolastay.com')
                ->send(new PaymentConfirmedAdminMail($reservation, $invoice));

        } catch (\Exception $e) {
            Log::error('Erro ao enviar Notificações de Pagamento: ' . $e->getMessage());
            $this->release(60); // Repor na fila para tentar novamente em 60s
        }
    }
}
