<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $fillable = [
        'client_id',
        'salutation',
        'first_name',
        'last_name',
        'email',
        'phone',
        'mobile',
        'address1',
        'position',
        'department',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function leads()
    {
        return $this->hasMany(Lead::class);
    }
}
