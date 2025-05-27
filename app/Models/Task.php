<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'name',
        'description',
        'task_order',
        'created_at',
        'updated_at',
    ];

    public function steps()
    {
        return $this->hasMany(\App\Models\Step::class)->orderBy('id');
    }

}
