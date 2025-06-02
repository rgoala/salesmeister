<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Workflow extends Model
{
    protected $fillable = [
        'lead_id',
        'task_id',
        'step_id',
        'status',
        'lastupdated_by',
        'assigned_to',
    ];

    public function leads()
    {
        return $this->hasMany(Lead::class);
    }
    
    public function lead()
    {
        return $this->belongsTo(\App\Models\Lead::class, 'lead_id');
    }

    public function task() { return $this->belongsTo(\App\Models\Task::class); }
    public function step() { return $this->belongsTo(\App\Models\Step::class); }
}
