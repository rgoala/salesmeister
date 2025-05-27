<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeadType extends Model
{
    protected $fillable = [
        'name',
        'description',
        'created_at',
        'updated_at',
    ];

    public function leads()
    {
        return $this->hasMany(Lead::class);
    }
}
