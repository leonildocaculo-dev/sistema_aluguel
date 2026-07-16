<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class KycRejectedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $userName;
    public $adminNotes;

    /**
     * Create a new message instance.
     */
    public function __construct(string $userName, ?string $adminNotes)
    {
        $this->userName = $userName;
        $this->adminNotes = $adminNotes;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'AngolaStay - Verificação de Identidade Rejeitada',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            htmlString: $this->getHtmlContent(),
        );
    }

    private function getHtmlContent(): string
    {
        $notesHtml = $this->adminNotes ? "<p><strong>Motivo da Rejeição:</strong> {$this->adminNotes}</p>" : "";
        return "
            <div style='font-family: sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2>Olá, {$this->userName}</h2>
                <p>Lamentamos informar que o seu documento de identificação submetido para o processo KYC foi rejeitado.</p>
                {$notesHtml}
                <p>Por favor, aceda ao seu painel de Proprietário na plataforma AngolaStay e submeta um novo documento válido e legível.</p>
                <br>
                <p>A Equipa,<br>AngolaStay</p>
            </div>
        ";
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
