<?php

namespace App\Services;

use App\Models\PaymentIntent;
use App\Events\PaymentExpired;

class PaymentExpirationService
{
    /**
     * Expira intenções de pagamento cujo prazo já passou.
     */
    public function expirePendingIntents(): int
    {
        $expiredIntents = PaymentIntent::where('status', 'pending')
            ->where('expires_at', '<', now())
            ->get();

        $count = 0;
        foreach ($expiredIntents as $intent) {
            $intent->update(['status' => 'expired']);
            event(new PaymentExpired($intent));
            $count++;
        }

        return $count;
    }
}
