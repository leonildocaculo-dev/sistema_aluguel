<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'province',
        'municipality',
        'address',
        'price_per_night',
        'status',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function accommodations()
    {
        return $this->hasMany(Accommodation::class);
    }

    public function images()
    {
        return $this->hasMany(PropertyImage::class);
    }
}
