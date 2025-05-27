<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'organization_name',
        'email',
        'phone',
        'fax',
        'address',
        'city',
        'state',
        'country',
        'zip',
        'website',
    ];

    public function contacts() {
        return $this->hasMany(\App\Models\Contact::class);
    }

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
