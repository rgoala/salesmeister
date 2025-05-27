<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Step extends Model
{
    
    protected $fillable = ['description', 'task_id'];

    public function task()
    {
        return $this->belongsTo(\App\Models\Task::class);
    }
}
