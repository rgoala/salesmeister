<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\Workflow;
use App\Models\Task;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function store(Request $request)
        {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'client_reference' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'lead_type_id' => 'required|integer|exists:lead_types,id',
                'client_id' => 'required|integer|exists:clients,id',
                'contact_id' => 'nullable|integer|exists:contacts,id',
                'lead_status' => 'nullable|string|max:50',
                'expected_close_date' => 'nullable|date',
                'actual_close_date' => 'nullable|date',
                'lastupdated_by' => 'nullable|integer|exists:users,id',
                'assigned_to' => 'nullable|integer|exists:users,id',
                'conversion' => 'nullable|in:Bid,DNB,Lost,Won,YTS',
                'conversion_notes' => 'nullable|string|max:255',
                'source' => 'nullable|string|max:50',
            ]);

        // Create the Lead
        $lead = Lead::create($request);

        // For every Task and its Steps, insert a Workflow record for each Step for this Lead
        $tasks = Task::with('steps')->get();
        foreach ($tasks as $task) {
            foreach ($task->steps as $step) {
                Workflow::create([
                    'lead_id' => $lead->id,
                    'task_id' => $task->id,
                    'step_id' => $step->id,
                    'status' => 'pending',
                    'assigned_to' => $request['assigned_to'] ?? null,
                ]);
            }
        }

        return redirect()->route('leads.index')->with('success', 'Lead created and workflow initialized!');
    }
}