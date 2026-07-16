<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    protected $fillable = [
        'name',
        'type',
        'description',
        'province',
        'municipality',
        'address',
        'price_per_night',
        'user_id',
        'status',
        'latitude',
        'longitude',
        'contact_phone',
        'contact_email',
        'contact_website',
        'video_path',
        'video_mime_type',
        'video_size_bytes',
        'video_duration_seconds',
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
