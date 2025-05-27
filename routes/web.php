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

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Dashboard

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Leads

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('leads', function () {
        return Inertia::render('leads/index');
    })->name('leads.index');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('clients', function () {
        return Inertia::render('admin/clients/index',['clients' => Client::all()]);
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
            'contacts.*.name' => 'required_with:contacts|string|max:255',
            'contacts.*.email' => 'nullable|email|max:255',
            'contacts.*.phone' => 'nullable|string|max:30',
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


Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('leads/store', function (Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'client_id' => 'required|integer|exists:clients,id',
            'client_reference' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
            'lead_type_id' => 'required|integer|exists:lead_types,id',
            'contact_id' => 'nullable|integer|exists:clients,contacts,id',
            'status' => 'nullable|string|max:50',
            'expected_close_date' => 'nullable|date',
            'actual_close_date' => 'nullable|date',
            'lastupdated_by' => 'nullable|integer|exists:users,id',
            'assigned_to' => 'nullable|integer|exists:users,id',
            'conversion' => 'nullable|enum:Bid,DNB,Lost,Won,YTS',
            'conversion_notes' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:50'
        ]);

        // Create the Lead
        $lead = Lead::create($validated);

        // For every Task and its Steps, insert a Workflow record for each Step for this Lead
        $tasks = Task::with('steps')->get();
        foreach ($tasks as $task) {
            foreach ($task->steps as $step) {
                Workflow::create([  
                    'lead_id' => $lead->id,
                    'task_id' => $task->id,
                    'step_id' => $step->id,
                    'status' => 'pending',
                    'assigned_to' => $validated['assigned_to'] ?? 1, // Use the assigned user if provided
                    // Add other Workflow fields as needed (e.g., status, assigned_to, etc.)
                ]);
            }
        }

        return redirect()->route('leads.index')->with('success', 'Lead created and workflow initialized!');
    })->name('leads.store');
});

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

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
