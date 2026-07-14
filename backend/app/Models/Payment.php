<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'reservation_id',
        'metodo',
        'valor',
        'referencia_gerada',
        'webhook_payload',
        'comprovativo_path',
        'estado',
        'idempotency_key',
        'validado_por',
        'data_pagamento',
    ];

    protected function casts(): array
    {
        return [
            'webhook_payload' => 'array',
            'data_pagamento' => 'datetime',
        ];
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function validator()
    {
        return $this->belongsTo(User::class, 'validado_por');
    }
}
