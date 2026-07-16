<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'whatsapp' => [
        'url' => env('WHATSAPP_API_URL'),
        'token' => env('WHATSAPP_API_TOKEN'),
    ],

    'proxypay' => [
        'url' => env('PROXYPAY_URL', 'https://api.sandbox.proxypay.co.ao'),
        'key' => env('PROXYPAY_API_KEY'),
        'secret' => env('PROXYPAY_WEBHOOK_SECRET'),
    ],

    'gpo' => [
        'url' => env('GPO_URL', 'https://api.sandbox.gpo.co.ao'),
        'key' => env('GPO_API_KEY'),
        'secret' => env('GPO_WEBHOOK_SECRET'),
    ],

];
