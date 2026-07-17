<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Event;
use App\Events\PaymentConfirmed;
use App\Listeners\SendPaymentConfirmationNotifications;

use App\Contracts\NotificationChannelInterface;
use App\Channels\WhatsAppChannel;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(NotificationChannelInterface::class, WhatsAppChannel::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (app()->environment('production')) {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }

        // Registar listeners de eventos
        Event::listen(
            PaymentConfirmed::class,
            SendPaymentConfirmationNotifications::class
        );

        // FASE 14: Segurança em Performance (Prevenção de N+1 Queries)
        // Isso vai disparar uma exceção se tentarmos carregar relações fora do eager loading
        Model::preventLazyLoading(!app()->isProduction());

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        RateLimiter::for('uploads', function (Request $request) {
            return Limit::perMinute(10)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('webhooks', function (Request $request) {
            // Webhooks can burst, but we limit to prevent DoS
            return Limit::perMinute(120)->by($request->ip());
        });
    }
}
