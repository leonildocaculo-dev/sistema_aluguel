<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Reservation;
use Illuminate\Support\Str;

class InvoiceService
{
    /**
     * Gera uma Fatura/Recibo para uma reserva recém-paga.
     */
    public function generateForReservation(Reservation $reservation, float $amountPaid): Invoice
    {
        // Verificar se já existe fatura para evitar duplicados
        $existingInvoice = Invoice::where('reservation_id', $reservation->id)->first();
        if ($existingInvoice) {
            return $existingInvoice;
        }

        // Determinar sequência (Simplificado para o momento)
        $year = date('Y');
        $count = Invoice::whereYear('created_at', $year)->count() + 1;
        $invoiceNumber = "FR {$year}/{$count}";

        // Obter dados do cliente
        $user = $reservation->user;
        
        // Simulação de cálculo de IVA (ex: 14% incluído no preço ou por cima)
        // Por agora, assumimos que o montante inclui IVA.
        // Formula: Base = Total / 1.14
        $taxRate = 0.14;
        $baseAmount = round($amountPaid / (1 + $taxRate), 2);
        $taxAmount = $amountPaid - $baseAmount;

        $invoice = Invoice::create([
            'reservation_id' => $reservation->id,
            'user_id' => $user->id,
            'invoice_number' => $invoiceNumber,
            'type' => 'fatura_recibo',
            'status' => 'issued',
            'base_amount' => $baseAmount,
            'tax_amount' => $taxAmount,
            'total_amount' => $amountPaid,
            'customer_name' => $user->name,
            'customer_nif' => null, // Poderá vir do perfil no futuro
            'customer_address' => null, // Poderá vir do perfil no futuro
            'hash' => $this->generateMockHash(),
            'issued_at' => now(),
        ]);

        return $invoice;
    }

    /**
     * Gera um mock de hash para demonstração (Requisito AGT requer chave RSA real).
     */
    private function generateMockHash(): string
    {
        return base64_encode(Str::random(32));
    }
}
