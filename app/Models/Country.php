<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $fillable = [
        
        'name',
        'code',
        'phone_code',
        'currency',
        'region',
        'subregion',
        'timezones',
    ];

    public function states()
    {
        return $this->hasMany(State::class);
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
