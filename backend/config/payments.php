<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Payment Gateways Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for different payment gateways used in the application.
    | Do not use env() directly in application code, use config('payments.proxypay.url')
    |
    */

    'proxypay' => [
        'url' => env('PROXYPAY_URL', 'https://api.sandbox.proxypay.co.ao'),
        'api_key' => env('PROXYPAY_API_KEY'),
        'webhook_secret' => env('PROXYPAY_WEBHOOK_SECRET'),
        'allowed_ips' => env('PROXYPAY_ALLOWED_IPS', ''),
        'timeout' => 5, // segundos
        'retries' => 3,
        'retry_delay' => 100, // ms
    ],

    'gpo' => [
        'url' => env('GPO_URL', 'https://api.sandbox.gpo.co.ao'),
        'api_key' => env('GPO_API_KEY'),
        'webhook_secret' => env('GPO_WEBHOOK_SECRET'),
        'allowed_ips' => env('GPO_ALLOWED_IPS', ''),
        'timeout' => 5,
        'retries' => 3,
        'retry_delay' => 100,
    ],

];
