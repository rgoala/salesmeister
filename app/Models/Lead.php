<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $fillable = [
        'id', 
        'name', 
        'client_reference', 
        'description', 
        'lead_type_id', 
        'client_id', 
        'contact_id', 
        'status', 
        'expected_close_date', 
        'actual_close_date', 
        'created_by', 
        'lastupdated_by', 
        'assigned_to', 
        'conversion', 
        'conversion_notes', 
        'lead_source', 
        'created_at', 
        'updated_at'
    ];

    public function client() { return $this->belongsTo(\App\Models\Client::class); }
    public function assignedToUser() { return $this->belongsTo(\App\Models\User::class, 'assigned_to'); }
    public function leadType() { return $this->belongsTo(\App\Models\LeadType::class, 'lead_type_id'); }
    public function workflows() { return $this->hasMany(\App\Models\Workflow::class); }

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

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    
    public function source()
    {
        return $this->belongsTo(Source::class);
    }
    
    public function status()
    {
        return $this->belongsTo(Status::class);
    }
}
