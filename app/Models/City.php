<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    protected $fillable = [
        'name',
        'state_id',
        'country_id',
        'latitude',
        'longitude',
        'population',
        'area',
    ];

    public function state()
    {
        return $this->belongsTo(State::class);
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
    }
    public function leads()
    {
        return $this->hasMany(Lead::class);
    }
}
