<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index()
    {
        // Fetch all clients from the database
        $clients = Client::all();

        // Return the view with the clients data
        return view('clients.index', compact($clients));
    }

    public function create()
    {
        // Show the form to create a new client
        return view('clients.create');
    }

    public function store(Request $request)
    {
        // Validate and store the new client data
        $validatedData = $request->validate([
            'organization_name' => 'nullable|string|max:255',
            'email' => 'required|email|unique:clients,email',
            'phone' => 'nullable|string|max:20',
            'fax' => 'nullable|string|max:20',
            'address1' => 'nullable|string|max:255',
            'address2' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'website' => 'nullable|url|max:255',
            'status' => 'active',
            'type' => 'nullable|string|max:50',
            'industry' => 'nullable|string|max:50',
            'tax_id' => 'nullable|string|max:50',
            'vat_number' => 'nullable|string|max:50',
            'currency' => 'nullable|in:AED,EUR,GBP,INR,PKR,USD,JPY',
        ]);

        Client::create($validatedData);

        return redirect()->route('clients.index')->with('success', 'Client created successfully.');
    }
    public function show($id)
    {
        // Fetch the client by ID
        $client = Client::findOrFail($id);

        // Return the view with the client data
        return view('clients.show', compact('client'));
    }
    public function edit($id)
    {
        // Fetch the client by ID
        $client = Client::findOrFail($id);

        // Return the view with the client data
        return view('clients.edit', compact('client'));
    }
    public function update(Request $request, $id)
    {
        // Validate and update the client data
        $validatedData = $request->validate([
            'organization_name' => 'nullable|string|max:255',
            'email' => 'required|email|unique:clients,email',
            'phone' => 'nullable|string|max:20',
            'fax' => 'nullable|string|max:20',
            'address1' => 'nullable|string|max:255',
            'address2' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'zip' => 'nullable|string|max:20',
            'website' => 'nullable|url|max:255',
            'status' => 'nullable|in:active,inactive',
            'type' => 'nullable|string|max:50',
            'industry' => 'nullable|string|max:50',
            'tax_id' => 'nullable|string|max:50',
            'vat_number' => 'nullable|string|max:50',
            'currency' => 'nullable|in:AED,EUR,GBP,INR,PKR,USD,JPY',
        ]);

        $client = Client::findOrFail($id);
        $client->update($validatedData);

        return redirect()->route('clients.index')->with('success', 'Client updated successfully.');
    }
    public function destroy($id)
    {
        // Delete the client by ID
        $client = Client::findOrFail($id);
        $validatedData = $request->validate([
            'status' => 'inactive',
        ]);
        $client->update($validatedData);

        return redirect()->route('clients.index')->with('success', 'Client deactivated successfully.');
    }
    public function getClientsByCityId($city)
    {
        // Fetch clients by city ID
        $clients = Client::where('city', $city)->get();

        // Return the clients as a JSON response
        return response()->json($clients);
    }
    public function getClientsByStateId($state)
    {
        // Fetch clients by state ID
        $clients = Client::where('state_id', $state)->get();

        // Return the clients as a JSON response
        return response()->json($clients);
    }
    public function getClientsByCountryId($country)
    {
        // Fetch clients by country ID
        $clients = Client::where('country_id', $country)->get();

        // Return the clients as a JSON response
        return response()->json($clients);
    }
    public function getClientsByStatus($status)
    {
        // Fetch clients by status
        $clients = Client::where('status', $status)->get();

        // Return the clients as a JSON response
        return response()->json($clients);
    }
    public function getClientsByType($type)
    {
        // Fetch clients by type
        $clients = Client::where('type', $type)->get();

        // Return the clients as a JSON response
        return response()->json($clients);
    }
    public function getClientsByIndustry($industry)
    {
        // Fetch clients by industry
        $clients = Client::where('industry', $industry)->get();

        // Return the clients as a JSON response
        return response()->json($clients);
    }
    public function getClientsByOrganizationName($organizationName)
    {
        // Fetch clients by organization name
        $clients = Client::where('organization_name', 'LIKE', '%' . $organizationName . '%')->get();

        // Return the clients as a JSON response
        return response()->json($clients);
    }
    public function getClientsByEmail($email)
    {
        // Fetch clients by email
        $clients = Client::where('email', 'LIKE', '%' . $email . '%')->get();

        // Return the clients as a JSON response
        return response()->json($clients);
    }
    public function getClientsByPhone($phone)
    {
        // Fetch clients by phone
        $clients = Client::where('phone', 'LIKE', '%' . $phone . '%')->get();

        // Return the clients as a JSON response
        return response()->json($clients);
    }
    public function getClientsByFax($fax)
    {
        // Fetch clients by fax
        $clients = Client::where('fax', 'LIKE', '%' . $fax . '%')->get();

        // Return the clients as a JSON response
        return response()->json($clients);
    }
}
