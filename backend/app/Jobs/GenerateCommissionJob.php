<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\PaymentIntent;
use App\Services\CommissionService;
use Exception;

class GenerateCommissionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public PaymentIntent $intent)
    {
    }

    /**
     * Usa o CommissionService para registar a transacção.
     */
    public function handle(CommissionService $commissionService): void
    {
        try {
            $commissionService->generateTransaction($this->intent);
        } catch (Exception $e) {
            // Lógica de falha, reportar ao Sentry
            throw $e;
        }
    }
}
