<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index()
    {
        // Fetch all tasks from the database
        $masterTasks = Task::all();

        // Return the tasks as a JSON response
        return response()->json($masterTasks);
    }

    public function show($id)
    {
        // Find a task by its ID
        $task = Task::find($id);

        // If the task is not found, return a 404 response
        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        // Return the task as a JSON response
        return response()->json($task);
    }


    public function store(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'taskorder' => 'required|integer',
        ]);

        // Create a new task
        $task = Task::create([
            'title' => $validatedData['title'],
            'description' => $validatedData['description'],
            'task_order' => $validatedData['taskorder'],
        ]);
        $task->save();

        return response()->json(['message' => 'Task created successfully', 'task' => $task], 201);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'task_order' => 'required|integer',
            'steps' => 'array',
            'steps.*.description' => 'required|string|max:255',
        ]);

        $task = \App\Models\Task::findOrFail($id);
        $task->update([
            'title' => $validatedData['title'],
            'description' => $validatedData['description'],
            'task_order' => $validatedData['task_order'],
        ]);

        // // Save steps (assuming Task hasMany Step)
        // $task->steps()->delete(); // Remove old steps
        // if (!empty($validatedData['steps'])) {
        //     foreach ($validatedData['steps'] as $stepData) {
        //         $task->steps()->create([
        //             'description' => $stepData['description'],
        //         ]);
        //     }
        // }
        if (!empty($validatedData['steps'])) {
            foreach ($validatedData['steps'] as $stepData) {
                // If step has an id, update it; otherwise, create new
                if (!empty($stepData['id'])) {
                    $task->steps()->updateOrCreate(
                        ['id' => $stepData['id']],
                        ['description' => $stepData['description']]
                    );
                } else {
                    $task->steps()->create([
                        'description' => $stepData['description'],
                    ]);
                }
            }
        }

        return redirect()->back()->with('success', 'Task updated successfully!');
    }
}
