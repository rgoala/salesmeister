<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Step extends Model
{
    
    protected $fillable = ['description', 'task_id'];

    // Relationship to the previous step (assuming you have a previous_step_id column)
    public function previousStep(): HasOne
    {
        return $this->hasOne(Step::class, 'id', 'id');
    }

    // Relationship to all workflows for this step
    public function workflows(): HasMany
    {
        return $this->hasMany(Workflow::class, 'step_id');
    }
    
    public function task()
    {
        return $this->belongsTo(\App\Models\Task::class);
    }
}
