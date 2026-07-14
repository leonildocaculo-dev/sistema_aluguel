<?php

namespace App\Services;

use App\Models\Reservation;
use App\Models\PaymentIntent;
use Illuminate\Support\Facades\App;
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
}
