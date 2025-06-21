<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;
use \App\Models\Client;
use \App\Models\Contact;
use \App\Models\Country;
use \App\Models\Task;
use \App\Models\User;
use \App\Models\LeadType;
use \App\Models\Lead;
use \App\Models\Workflow;
use \App\Models\Step;
use App\Models\WorkflowAttachment;
use Illuminate\Support\Facades\Storage;
use App\Models\Comment;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Dashboard

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });

// Leads

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('leads', function () {
        $user = auth()->user();

        $query = \App\Models\Lead::with([
            'client:id,organization_name',
            'assignedToUser:id,name',
            'leadType:id,title',
            'workflows.task:id,title',
            'workflows.step:id,description'
        ]);

        // If not superadmin, only show leads assigned to the user
        if ($user->role !== 'superadmin') {
            $query->where('assigned_to', $user->id);
        }

        $leads =$query->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($lead) {
                return [
                    'id' => $lead->id,
                    'name' => $lead->name,
                    'client_name' => $lead->client ? $lead->client->organization_name : null,
                    'status' => $lead->status,
                    'expected_close_date' => $lead->expected_close_date,
                    'assigned_to' => $lead->assignedToUser ? $lead->assignedToUser->name : null,
                    'lead_type' => $lead->leadType ? ['title' => $lead->leadType->name] : null,
                    'workflows' => $lead->workflows->map(function ($wf) {
                        // Get attachments for this workflow step
                        $attachments = \App\Models\WorkflowAttachment::where('workflow_id', $wf->id)
                            ->get()
                            ->map(function ($att) {
                                return [
                                    'id' => $att->id,
                                    'filename' => $att->filename,
                                    'url' => \Illuminate\Support\Facades\Storage::url($att->file_path),
                                ];
                            });

                        // Fetch assigned_to user name
                        $assignedToUser = $wf->assigned_to
                            ? \App\Models\User::find($wf->assigned_to)
                            : null;
                        
                        // Fetch comments for this workflow step, with user name
                        $comments = \App\Models\Comment::where('workflow_id', $wf->id)
                            ->orderBy('created_at', 'desc')
                            ->get()
                            ->map(function ($comment) {
                                return [
                                    'id' => $comment->id,
                                    'comment' => $comment->comment,
                                    'user_name' => $comment->user ? $comment->user->name : null,
                                    'created_at' => $comment->created_at ? $comment->created_at->toDateTimeString() : null,
                                ];
                            });

                         return [
                            'id' => $wf->id,
                            'task_title' => $wf->task ? $wf->task->title : '',
                            'step_description' => $wf->step ? $wf->step->description : '',
                            'status' => $wf->status,
                            'updated_at' => $wf->updated_at ? $wf->updated_at->toDateTimeString() : null,
                            'attachments' => $attachments,
                            'assigned_to' => $assignedToUser ? $assignedToUser->name : null, // Show user name
                            'comments' => $comments,
                        ];
                    }),
                ];
            });

        return Inertia::render('leads/index', [
            'leads' => $leads
        ]);
    })->name('leads.index');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('leads/status-summary', function () {
        // Group leads by status and count them
        $statusCounts = \App\Models\Lead::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        // Ensure all statuses are present (Open, In-progress, Closed)
        $allStatuses = ['New', 'In-progress', 'Closed'];
        $result = [];
        foreach ($allStatuses as $status) {
            $result[$status] = $statusCounts[$status] ?? 0;
        }

        return response()->json($result);
    });
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('leads/by-task-category', function () {
        // Get all tasks ordered by task_order
        $tasks = \App\Models\Task::orderBy('task_order')->get();

        // Get all workflows grouped by lead
        $workflowsByLead = \App\Models\Workflow::with('task')
            ->get()
            ->groupBy('lead_id');

        $result = [];
        $countedLeads = [];

        foreach ($tasks as $task) {
            $count = 0;
            foreach ($workflowsByLead as $leadId => $workflows) {
                if (in_array($leadId, $countedLeads)) {
                    continue; // Already counted for a previous task
                }
                // Order workflows by task order
                $ordered = $workflows->sortBy(function ($wf) use ($tasks) {
                    return $tasks->search(function ($t) use ($wf) {
                        return $t->id == $wf->task_id;
                    });
                })->values();

                // Find the first workflow that is not completed
                foreach ($ordered as $wf) {
                    if (strtolower($wf->status) !== 'completed') {
                        if ($wf->task_id == $task->id) {
                            $count++;
                            $countedLeads[] = $leadId;
                        }
                        break;
                    }
                }
                // If all are completed, count the last task as current
                if ($ordered->every(fn($wf) => strtolower($wf->status) === 'completed')) {
                    if ($ordered->last()->task_id == $task->id) {
                        $count++;
                        $countedLeads[] = $leadId;
                    }
                }
            }
            $result[$task->title] = $count;
        }

        return response()->json($result);
    });
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/workflows/{workflow}/edit', function (Workflow $workflow) {
        $lead = Lead::find($workflow->lead_id);
        $users = User::select('id', 'name')->get();
        
         // Get assigned_to user name if available
        $assignedToUser = $workflow->assigned_to
            ? User::find($workflow->assigned_to)
            : null;
        
        return Inertia::render('workflows/edit', [
            'workflow' => [
                'id' => $workflow->id,
                'task_title' => $workflow->task ? $workflow->task->title : '',
                'step_description' => $workflow->step ? $workflow->step->description : '',
                'status' => $workflow->status,
                'assigned_to' => $assignedToUser ? $assignedToUser->name : null,
                'data' => $workflow->data ?? '',
            ],
            'lead' => [
                'id' => $lead->id,
                'name' => $lead->name,
            ],
            'users' => $users,
        ]);
    })->name('workflows.edit');
});

Route::middleware(['auth', 'verified'])->group(function () {

    // Get next step info for skip modal
    Route::get('/workflows/{workflow}/next-task-info', function (Workflow $workflow) {
        // Get all steps for the current task ordered by id (or use step_order if available)
        $steps = Step::where('task_id', $workflow->task_id)->orderBy('id')->get();
        $currentStepIndex = $steps->search(fn($s) => $s->id == $workflow->step_id);

        // Next step is the next in order, or null if last
        $nextStep = $steps->get($currentStepIndex + 1);
        $nextStepDescription = $nextStep ? $nextStep->description : null;

        // Assignable users (example: all users, or filter as needed)
        $assignToOptions = User::select('id', 'name')->get();

        return response()->json([
            'nextTaskTitle' => $nextStepDescription,
            'assignToOptions' => $assignToOptions,
        ]);
    });

    // Handle skip action for a step
    Route::post('/workflows/{workflow}/skip', function (Request $request, Workflow $workflow) {
        $validated = $request->validate([
            'comment' => 'required|string|max:1000',
            'assign_to' => 'nullable|exists:users,id',
        ]);

        // Mark current workflow step as skipped
        $workflow->status = 'skipped';
        $workflow->comment = $validated['comment'];
        $workflow->save();

        // Move to next step if exists
        $steps = Step::where('task_id', $workflow->task_id)->orderBy('id')->get();
        $currentStepIndex = $steps->search(fn($s) => $s->id == $workflow->step_id);
        $nextStep = $steps->get($currentStepIndex + 1);

        if ($nextStep) {
            // Find or create the next workflow step for this lead, task, and step
            $nextWorkflow = Workflow::firstOrCreate(
                [
                    'lead_id' => $workflow->lead_id,
                    'task_id' => $workflow->task_id,
                    'step_id' => $nextStep->id,
                ],
                [
                    'status' => 'pending',
                ]
            );
            // Assign to selected user if provided
            if (!empty($validated['assign_to'])) {
                $nextWorkflow->assigned_to = $validated['assign_to'];
                $nextWorkflow->save();
            }
        }

        return response()->json(['success' => true]);
    });
});


// Clients
// This route will render the clients index page with all clients and their contacts.
// It will eager load contacts and leads count to optimize performance.
// It also ensures that the user is authenticated and verified before accessing this route.
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('clients', function () {
        $clients = Client::with(['contacts:id,client_id,first_name,last_name'])
            ->withCount('leads')
            ->get()
            ->map(function ($client) {
                return [
                    'id' => $client->id,
                    'organization_name' => $client->organization_name,
                    'email' => $client->email,
                    'phone' => $client->phone,
                    'contacts' => $client->contacts->map(function ($contact) {
                        return [
                            'id' => $contact->id,
                            'first_name' => $contact->first_name,
                            'last_name' => $contact->last_name,
                        ];
                    }),
                    'leads_count' => $client->leads_count,
                ];
            });

        return Inertia::render('admin/clients/index', [
            'clients' => $clients
        ]);
    })->name('clients.index');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('admin/clients/create', function () {
        return Inertia::render('admin/clients/create');
    })->name('clients.create');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('countries/getcountries', function () {
        return json_encode($countries = Country::all());
    })->name('countries.getcountries');
});

// In routes/web.php
Route::get('/states/by-country/{country}', function ($countryId) {
    return \App\Models\State::where('country_id', $countryId)->get();
});
Route::get('/cities/by-state/{state}', function ($stateId) {
    return \App\Models\City::where('state_id', $stateId)->get();
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('users', function () {
        return Inertia::render('admin/users/index', [
            'users' => User::all()
        ]);
    })->name('users.index');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('tasks', function () {
        // Eager load steps for each task
        return Inertia::render('admin/tasks/index', [
            'tasks' => Task::with('steps')->orderBy('task_order')->get()
        ]);
    })->name('tasks.index');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('tasks/create', function () {
        return Inertia::render('admin/tasks/create');
    })->name('tasks.create');
});


Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('tasks/store', function (Request $request) {
        $task = new Task();
        $task->title = $request->title;
        $task->description = $request->description;
        $task->task_order = $request->task_order;
        $task->save();
        return redirect()->route('tasks.index');
    })->name('tasks.store');
});


Route::middleware(['auth', 'verified'])->group(function () {
    // Show edit client form
    Route::get('admin/clients/{client}/edit', function (Client $client) {
        // Eager load contacts and countries for the form
        $countries = Country::all();
        $client->load('contacts');
        return Inertia::render('admin/clients/edit', [
            'client' => $client,
            'countries' => $countries,
        ]);
    })->name('clients.edit');

    // Update client and contacts
    Route::put('admin/clients/{client}/update', function (Request $request, Client $client) {
        $validated = $request->validate([
            'organization_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:30',
            'fax' => 'nullable|string|max:30',
            'address1' => 'nullable|string|max:255',
            'address2' => 'nullable|string|max:255',
            'city_id' => 'nullable|integer',
            'state_id' => 'nullable|integer',
            'country_id' => 'nullable|integer',
            'zip' => 'nullable|string|max:20',
            'website' => 'nullable|string|max:255',
            'contacts' => 'array',
            'contacts.*.name' => 'required_with:contacts|string|max:255',
            'contacts.*.email' => 'nullable|email|max:255',
            'contacts.*.phone' => 'nullable|string|max:30',
        ]);

        $client->update($validated);

        // Sync contacts: update existing, add new, remove missing
        $existingIds = [];
        if (!empty($validated['contacts'])) {
            foreach ($validated['contacts'] as $contactData) {
                if (!empty($contactData['id'])) {
                    // Update existing
                    $client->contacts()->updateOrCreate(
                        ['id' => $contactData['id']],
                        [
                            'name' => $contactData['name'],
                            'email' => $contactData['email'] ?? null,
                            'phone' => $contactData['phone'] ?? null,
                        ]
                    );
                    $existingIds[] = $contactData['id'];
                } else {
                    // Create new
                    $newContact = $client->contacts()->create([
                        'name' => $contactData['name'],
                        'email' => $contactData['email'] ?? null,
                        'phone' => $contactData['phone'] ?? null,
                    ]);
                    $existingIds[] = $newContact->id;
                }
            }
        }
        // Remove contacts not present in the request
        $client->contacts()->whereNotIn('id', $existingIds)->delete();

        return redirect()->route('clients.index')->with('success', 'Client updated successfully!');
    })->name('clients.update');
});

// Update Task (with steps support)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::put('admin/tasks/{task}/update', function (Request $request, Task $task) {
        // Update the task fields
        $task->update([
            'title' => $request->title,
            'description' => $request->description,
            'task_order' => $request->task_order,
        ]);

        // Handle steps if provided
        if ($request->has('steps')) {
            // Remove old steps
            $task->steps()->delete();
            // Add new steps
            foreach ($request->steps as $step) {
                $task->steps()->create([
                    'description' => $step['description'],
                ]);
            }
        }

        return redirect()->route('tasks.index');
    })->name('tasks.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::put('users/{$user}/update', function (Request $request, User $user) {
            $user->update($request->all());
            return redirect()->route('users.index');
        });
});

// Store Client
// This route handles the creation of a new client.
// It validates the request data, creates the client, and adds contacts if provided.
// It also ensures that the user is authenticated and verified before accessing this route.
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('clients/store', function (Request $request) {
        $validated = $request->validate([
            'organization_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:30',
            'fax' => 'nullable|string|max:30',
            'address1' => 'nullable|string|max:255',
            'address2' => 'nullable|string|max:255',
            'city_id' => 'nullable|integer',
            'state_id' => 'nullable|integer',
            'country_id' => 'nullable|integer',
            'zip' => 'nullable|string|max:20',
            'website' => 'nullable|string|max:255',
            'contacts' => 'array',
            'contacts.*.salutation' => 'nullable|string|max:50',
            'contacts.*.first_name' => 'required_with:contacts|string|max:255',
            'contacts.*.last_name' => 'required_with:contacts|string|max:255',
            'contacts.*.email' => 'nullable|email|max:255',
            'contacts.*.phone' => 'nullable|string|max:30',
            'contacts.*.mobile' => 'nullable|string|max:30',
            'contacts.*.address1' => 'nullable|string|max:255',
            'contacts.*.position' => 'nullable|string|max:100',
            'contacts.*.department' => 'nullable|string|max:100',                
        ]);

        // Create the client
        $client = Client::create($validated);

        // Add contacts if provided
        if (!empty($validated['contacts'])) {
            foreach ($validated['contacts'] as $contactData) {
                $client->contacts()->create($contactData);
            }
        }

        return redirect()->route('clients.index')->with('success', 'Client created successfully!');
    })->name('clients.store');
});


// Store Lead
// This route handles the creation of a new lead.
// It validates the request data, creates the lead, and initializes the workflow steps.
// It also ensures that the user is authenticated and verified before accessing this route.
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('leads/store', function (Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'client_id' => 'required|integer|exists:clients,id',
            'client_reference' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
            'lead_type_id' => 'required|integer|exists:lead_types,id',
            'contact_id' => 'nullable|integer|exists:contacts,id',
            'status' => 'nullable|string|max:50',
            'expected_close_date' => 'nullable|date',
            'actual_close_date' => 'nullable|date',
            'created_by' => 'nullable|integer|exists:users,id',
            'lastupdated_by' => 'nullable|integer|exists:users,id',
            'assigned_to' => 'nullable|integer|exists:users,id',
            'conversion' => 'nullable|string|max:20,',
            'conversion_notes' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:50'
        ]);

        // Create the Lead
        $lead = Lead::create($validated);

        // For every Task and its Steps, insert a Workflow record for each Step for this Lead
        $tasks = Task::with('steps')->get();
        $firstStepCreated = false;
        foreach ($tasks as $task) {
            foreach ($task->steps as $step) {
                Workflow::create([
                    'lead_id' => $lead->id,
                    'task_id' => $task->id,
                    'step_id' => $step->id,
                    'status' => !$firstStepCreated ? 'completed' : 'pending', // Mark the very first as completed
                    'lastupdated_by' => $validated['lastupdated_by'] ?? auth()->id(),
                    'assigned_to' => $validated['assigned_to'] ?? 1,
                ]);
                if (!$firstStepCreated) {
                    $firstStepCreated = true;
                }
            }
        }

        return redirect()->route('leads.index')->with('success', 'Lead created and workflow initialized!');
    })->name('leads.store');
});


// Create Lead Form
// This route will render the form for creating a new lead
// It will fetch necessary data like clients, lead types, users, and contacts
// and pass them to the Inertia view for rendering.
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('leads/create', function () {
        // Fetch clients and lead types for the form
        $clients = Client::all();
        $leadTypes = LeadType::all();
        $users = User::all();
        $contacts = Contact::all();
        return Inertia::render('leads/create', [
            'clients' => $clients,
            'leadTypes' => $leadTypes,
            'users' => $users,
            'contacts' => $contacts
        ]);
    })->name('leads.create');
});

// Update Workflow Step
// This route handles the update of a workflow step, including saving comments and attachments.
// It validates the request data, updates the workflow status, saves comments,
// and handles file uploads for attachments.
// It also ensures that the user is authenticated and verified before accessing this route.
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/workflows/{workflow}/update', function (Request $request, Workflow $workflow) {
        $validated = $request->validate([
            'status' => 'required|string|max:50',
            'assigned_to' => 'nullable|exists:users,id',
            'data' => 'required|string',
            'attachments.*' => 'file|mimes:pdf,xlsx,docx,jpg,jpeg,png|max:10240',
        ]);

        // Update workflow step (do NOT save 'data' here)
        $workflow->status = $validated['status'];
        $workflow->assigned_to = $validated['assigned_to'] ?? $workflow->assigned_to;
        $workflow->save();

        // Save comment to comments table
        Comment::create([
            'lead_id' => $workflow->lead_id, 
            'workflow_id' => $workflow->id,
            'user_id' => Auth::id(),
            'comment' => $validated['data'],
        ]);

        // Handle file uploads
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('workflow_attachments');
                WorkflowAttachment::create([
                    'workflow_id' => $workflow->id,
                    'filename' => $file->getClientOriginalName(),
                    'file_path' => $path,
                ]);
            }
        }

        return redirect()->route('leads.index')->with('success', 'Workflow step updated successfully!');
    })->name('workflows.update');
});

// My Tasks
// This route will render the my-tasks page for the authenticated user.
Route::middleware(['auth', 'verified'])->group(function () {
Route::get('dashboard', function () {
    $user = auth()->user();
    $steps = Workflow::with(['lead', 'assignedByUser'])
        ->where('assigned_to', $user->id)
        ->where('status', 'pending') // Only fetch pending items
        ->where(function ($query) {
                $query->whereHas('step', function ($q) {
                    // Only steps that are the first in their task
                    $q->whereDoesntHave('previousStep');
                })
                ->orWhereHas('step.previousStep', function ($q) {
                    // Or steps where the previous step is completed or skipped
                    $q->whereHas('workflows', function ($wq) {
                        $wq->whereIn('status', ['completed', 'skipped']);
                    });
                });
            })
        ->orderBy('updated_at', 'desc')
        ->paginate(5);

    return Inertia::render('dashboard', [
        'steps' => $steps->items(),
        'currentPage' => $steps->currentPage(),
        'lastPage' => $steps->lastPage(),
    ]);
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
