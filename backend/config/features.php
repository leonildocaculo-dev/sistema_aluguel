<?php

return [

    /*
    |--------------------------------------------------------------------------
    | AngolaStay Feature Flags
    |--------------------------------------------------------------------------
    |
    | Centralized configuration for application feature flags.
    | This allows features to be toggled per-environment using .env
    | without modifying code. Follow the Twelve-Factor App methodology.
    |
    */

    'password_breach_check' => env('FEATURE_PASSWORD_BREACH_CHECK', false),
    
    'payments' => [
        'proxypay' => env('FEATURE_PAYMENTS_PROXYPAY', true),
        'gpo' => env('FEATURE_PAYMENTS_GPO', false),
    ],

    'integrations' => [
        'whatsapp_business' => env('FEATURE_WHATSAPP_BUSINESS', false),
        'mapbox' => env('FEATURE_MAPBOX', true),
        'sentry' => env('FEATURE_SENTRY', false),
        'cloudflare_r2' => env('FEATURE_CLOUDFLARE_R2', false),
    ],

    'capabilities' => [
        'ocr' => env('FEATURE_OCR_KYC', false),
        'ai_recommendations' => env('FEATURE_AI_RECOMMENDATIONS', false),
        'emails' => env('FEATURE_EMAILS', true),
        'sms' => env('FEATURE_SMS', false),
        'push_notifications' => env('FEATURE_PUSH_NOTIFICATIONS', false),
    ],

    'infrastructure' => [
        'uploads' => env('FEATURE_UPLOADS', true),
        'background_jobs' => env('FEATURE_BACKGROUND_JOBS', false),
        'caching' => env('FEATURE_CACHING', true),
        'analytics' => env('FEATURE_ANALYTICS', false),
    ],

    'debug' => [
        'tools' => env('FEATURE_DEBUG_TOOLS', env('APP_DEBUG', false)),
    ],

];
