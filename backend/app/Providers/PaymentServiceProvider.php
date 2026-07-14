<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Contracts\PaymentGatewayInterface;
use App\Gateways\ProxyPayGateway;
use App\Gateways\GpoIframeGateway;
use App\Gateways\ManualTransferGateway;
use Illuminate\Support\Facades\App;

class PaymentServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bindings baseados em nome
        $this->app->bind('gateway.proxypay', ProxyPayGateway::class);
        $this->app->bind('gateway.gpo_iframe', GpoIframeGateway::class);
        $this->app->bind('gateway.manual', ManualTransferGateway::class);

        // Alias estático para um default (fallback)
        $this->app->bind(PaymentGatewayInterface::class, ProxyPayGateway::class);
    }

    public function boot(): void
    {
        //
    }
}
