<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index()
    {
        // Fetch all contacts from the database
        $contacts = Contact::all();

        // Return the contacts as a JSON response
        return response()->json($contacts);
    }

    public function show($id)
    {
        // Find a contact by its ID
        $contact = Contact::find($id);

        // If the contact is not found, return a 404 response
        if (!$contact) {
            return response()->json(['message' => 'Contact not found'], 404);
        }

        // Return the contact as a JSON response
        return response()->json($contact);
    }
    public function store(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'created_by' => 'required|exists:users,id',
        ]);

        // Create a new contact
        $contact = Contact::create($validatedData);

        // Return the created contact as a JSON response
        return response()->json($contact, 201);
    }
    public function update(Request $request, $id)
    {
        // Find the contact by its ID
        $contact = Contact::find($id);

        // If the contact is not found, return a 404 response
        if (!$contact) {
            return response()->json(['message' => 'Contact not found'], 404);
        }

        // Validate the incoming request data
        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255',
            'phone' => 'sometimes|nullable|string|max:20',
            'address' => 'sometimes|nullable|string|max:255',
            'created_by' => 'sometimes|required|exists:users,id',
        ]);

        // Update the contact
        $contact->update($validatedData);

        // Return the updated contact as a JSON response
        return response()->json($contact);
    }
    public function destroy($id)
    {
        // Find the contact by its ID
        $contact = Contact::find($id);

        // If the contact is not found, return a 404 response
        if (!$contact) {
            return response()->json(['message' => 'Contact not found'], 404);
        }

        // Delete the contact
        $contact->delete();

        // Return a success message
        return response()->json(['message' => 'Contact deleted successfully']);
    }
    public function search(Request $request)
    {
        // Validate the search query
        $request->validate([
            'query' => 'required|string|max:255',
        ]);

        // Search for contacts based on the query
        $contacts = Contact::where('name', 'LIKE', '%' . $request->query . '%')
            ->orWhere('email', 'LIKE', '%' . $request->query . '%')
            ->orWhere('phone', 'LIKE', '%' . $request->query . '%')
            ->get();

        // Return the search results as a JSON response
        return response()->json($contacts);
    }
    public function filter(Request $request)
    {
        // Validate the filter parameters
        $request->validate([
            'created_by' => 'sometimes|exists:users,id',
            'created_at' => 'sometimes|date',
            'updated_at' => 'sometimes|date',
        ]);

        // Build the query based on the filter parameters
        $query = Contact::query();

        if ($request->has('created_by')) {
            $query->where('created_by', $request->created_by);
        }

        if ($request->has('created_at')) {
            $query->whereDate('created_at', $request->created_at);
        }

        if ($request->has('updated_at')) {
            $query->whereDate('updated_at', $request->updated_at);
        }

        // Execute the query and get the results
        $contacts = $query->get();

        // Return the filtered contacts as a JSON response
        return response()->json($contacts);
    }
    public function import(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'file' => 'required|file|mimes:csv,xlsx,xls|max:2048',
        ]);

        // Handle the file upload and import logic here
        // For example, you can use a package like Maatwebsite Excel to handle the import

        // Return a success message
        return response()->json(['message' => 'Contacts imported successfully']);
    }
    public function export(Request $request)
    {
        // Validate the export parameters
        $request->validate([
            'format' => 'required|in:csv,xlsx',
        ]);

        // Handle the export logic here
        // For example, you can use a package like Maatwebsite Excel to handle the export

        // Return a success message
        return response()->json(['message' => 'Contacts exported successfully']);
    }
}
