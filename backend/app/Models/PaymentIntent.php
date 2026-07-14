<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PaymentIntent extends Model
{
    protected $fillable = [
        'uuid',
        'reservation_id',
        'gateway',
        'amount',
        'currency',
        'gateway_reference',
        'gateway_response',
        'status',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'gateway_response' => 'array',
            'expires_at' => 'datetime',
        ];
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = Str::uuid()->toString();
            }
        });
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}
