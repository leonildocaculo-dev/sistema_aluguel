<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

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
        //
    }
}
