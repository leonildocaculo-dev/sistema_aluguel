<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'user_id',
        'accommodation_id',
        'check_in',
        'check_out',
        'total_price',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function accommodation()
    {
        return $this->belongsTo(Accommodation::class);
    }

    public function availability()
    {
        return $this->hasOne(Availability::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function paymentIntents()
    {
        return $this->hasMany(PaymentIntent::class);
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }
}
