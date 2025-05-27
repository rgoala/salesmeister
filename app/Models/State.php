<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class State extends Model
{
    protected $fillable = [
        'name',
        'country_id',
        'code',
        'phone_code',
        'latitude',
        'longitude',
        'population',
        'area',
    ];

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function cities()
    {
        return $this->hasMany(City::class);
    }

    public function leads()
    {
        return $this->hasMany(Lead::class);
    }
}
