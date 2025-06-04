<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkflowAttachment extends Model
{
    protected $fillable = [
        'workflow_id',
        'filename',
        'file_path',
    ];

    public function workflow()
    {
        return $this->belongsTo(Workflow::class);
    }
}
