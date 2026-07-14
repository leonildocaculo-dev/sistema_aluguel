<?php

namespace App\Services;

use App\Models\PaymentIntent;
use App\Models\Transaction;

class CommissionService
{
    /**
     * Calcula e regista a transacção financeira com a divisão de valores.
     */
    public function generateTransaction(PaymentIntent $intent): Transaction
    {
        $reservation = $intent->reservation;
        $totalAmount = $intent->amount;
        
        // Exemplo: Comissão fixa de 10% ou buscar das definições globais
        $commissionRate = 10.00;
        
        $platformFee = $totalAmount * ($commissionRate / 100);
        $ownerAmount = $totalAmount - $platformFee;

        // Na arquitetura original, a transacção liga-se ao Payment oficial e não apenas à Intent
        // Assumimos que o $intent->reservation->payment (se existir) será actualizado.
        // O ID do pagamento real seria gerado neste ponto.
        $paymentId = $reservation->payment->id ?? 1; // Fallback se não migrado ainda

        return Transaction::create([
            'reservation_id' => $reservation->id,
            'payment_id' => $paymentId,
            'total_amount' => $totalAmount,
            'platform_fee' => $platformFee,
            'owner_amount' => $ownerAmount,
            'commission_rate' => $commissionRate,
            'status' => 'pending_settlement',
        ]);
    }
}
