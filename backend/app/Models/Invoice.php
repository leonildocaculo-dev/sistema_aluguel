<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id',
        'user_id',
        'invoice_number',
        'type',
        'status',
        'base_amount',
        'tax_amount',
        'total_amount',
        'customer_name',
        'customer_nif',
        'customer_address',
        'hash',
        'issued_at',
    ];

    protected $casts = [
        'issued_at' => 'datetime',
        'base_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
