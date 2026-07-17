<?php

namespace App\Services;

use App\Models\Reservation;
use App\Models\PaymentIntent;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use App\Models\AuditLog;
use App\Models\User;
use InvalidArgumentException;

class PaymentService
{
    /**
     * Processa o checkout inicial criando a Intenção de Pagamento
     */
    public function initiatePayment(Reservation $reservation, string $gatewayName): PaymentIntent
    {
        $amount = $reservation->total_price;

        // O Laravel resolverá a classe correta com base no nome registado no ServiceProvider
        try {
            $gateway = App::make('gateway.' . $gatewayName);
        } catch (\Exception $e) {
            throw new InvalidArgumentException("Método de pagamento não suportado: {$gatewayName}");
        }

        return $gateway->createIntent($reservation, $amount);
    }

    /**
     * Aprova manualmente um pagamento por transferência
     */
    public function approveManualPayment(int $paymentId, User $adminUser)
    {
        $payment = \App\Models\Payment::where('estado', 'aguarda_validação')->findOrFail($paymentId);

        return DB::transaction(function () use ($payment, $adminUser) {
            $payment->update([
                'estado' => 'confirmado',
                'validado_por' => $adminUser->id,
                'data_pagamento' => now(),
            ]);

            $payment->reservation->update(['status' => 'confirmado']);

            AuditLog::create([
                'user_id' => $adminUser->id,
                'action' => 'approved_payment',
                'model_type' => \App\Models\Payment::class,
                'model_id' => $payment->id,
                'new_values' => ['estado' => 'confirmado'],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return $payment;
        });
    }

    /**
     * Rejeita manualmente um pagamento por transferência
     */
    public function rejectManualPayment(int $paymentId, User $adminUser)
    {
        $payment = \App\Models\Payment::where('estado', 'aguarda_validação')->findOrFail($paymentId);

        return DB::transaction(function () use ($payment, $adminUser) {
            $payment->update([
                'estado' => 'rejeitado',
                'validado_por' => $adminUser->id,
            ]);

            $payment->reservation->update(['status' => 'rejeitado']);
            $payment->reservation->availability()->delete();

            AuditLog::create([
                'user_id' => $adminUser->id,
                'action' => 'rejected_payment',
                'model_type' => \App\Models\Payment::class,
                'model_id' => $payment->id,
                'new_values' => ['estado' => 'rejeitado'],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return $payment;
        });
    }
}
