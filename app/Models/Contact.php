<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $fillable = [
        'salutation',
        'first_name',
        'last_name',
        'email',
        'phone',
        'mobile',
        'address',
        'city_id',
        'state_id',
        'country_id',
        'zip',
        'notes',
        'client_id',
    ];

    

    public function city()
    {
        return $this->belongsTo(City::class);
    }

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
