<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Workflow extends Model
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

    public function steps()
    {
        return $this->hasMany(Step::class);
    }
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
