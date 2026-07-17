<?php

namespace App\Mail;

use App\Models\Invoice;
use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentConfirmedClientMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $reservation;
    public $invoice;

    /**
     * Create a new message instance.
     */
    public function __construct(Reservation $reservation, Invoice $invoice)
    {
        $this->reservation = $reservation;
        $this->invoice = $invoice;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Confirmação de Pagamento - AngolaStay',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.payment_confirmed_client',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        // Aqui futuramente anexaremos o PDF do Recibo gerado pelo DomPDF
        return [];
    }
}
