<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Services\PaymentExpirationService;

class ExpireReservationsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Executado pelo Scheduler periodicamente (ex: a cada 5 min).
     */
    public function handle(PaymentExpirationService $expirationService): void
    {
        $expirationService->expirePendingIntents();
    }
}
