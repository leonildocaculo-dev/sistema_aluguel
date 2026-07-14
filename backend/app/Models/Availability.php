<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Availability extends Model
{
    protected $fillable = [
        'accommodation_id',
        'start_date',
        'end_date',
        'is_blocked',
        'reservation_id',
    ];

    public function accommodation()
    {
        return $this->belongsTo(Accommodation::class);
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}
