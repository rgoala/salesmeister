<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class MasterTask extends Model
{
    protected $fillable = [
        'name',
        'description',
        'task_order',
        'created_at',
        'updated_at',
    ];

    static public function insertMasterTask(Request $request)
    {
        $task = new MasterTask();
        $task->name = $request->name;
        $task->description = $request->description;
        $task->task_order = $request->task_order;
        $task->save();

        return response()->json(['message' => 'Task created successfully', 'task' => $task], 201);
    }
}
