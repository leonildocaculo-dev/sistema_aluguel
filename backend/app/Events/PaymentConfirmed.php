<?php

namespace App\Events;

use App\Models\PaymentIntent;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PaymentConfirmed
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public PaymentIntent $intent)
    {
    }
}
