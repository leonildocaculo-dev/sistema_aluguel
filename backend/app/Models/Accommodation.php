<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Accommodation extends Model
{
    protected $fillable = [
        'property_id',
        'name',
        'description',
        'capacity',
        'price_per_night',
        'quantity',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
