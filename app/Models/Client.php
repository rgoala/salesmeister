<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use \App\Models\Contact;

class Client extends Model
{
    protected $fillable = [
        'organization_name',
        'email',
        'phone',
        'fax',
        'address1',
        'address2',
        'city_id',
        'state_id',
        'country_id',
        'zip',
        'website',
        'industry',
        'status',
        'tax_id',
        'currency',
    ];

    public function contacts() {
        return $this->hasMany(Contact::class);
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
