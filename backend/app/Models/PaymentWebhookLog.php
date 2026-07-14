<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentWebhookLog extends Model
{
    protected $fillable = [
        'gateway',
        'event_type',
        'payload',
        'ip_address',
        'is_verified',
        'is_processed',
        'processing_error',
    ];

    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'is_verified' => 'boolean',
            'is_processed' => 'boolean',
        ];
    }
}
