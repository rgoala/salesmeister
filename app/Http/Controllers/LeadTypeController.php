<?php

namespace App\Http\Controllers;

use App\Models\LeadType;
use Illuminate\Http\Request;

class LeadTypeController extends Controller
{
    // List all lead types
    public function index()
    {
        $leadTypes = LeadType::all();
        return response()->json($leadTypes);
    }

    // Store a new lead type
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $leadType = LeadType::create($validated);
        return response()->json($leadType, 201);
    }

    // Show a single lead type
    public function show($id)
    {
        $leadType = LeadType::findOrFail($id);
        return response()->json($leadType);
    }

    // Update a lead type
    public function update(Request $request, $id)
    {
        $leadType = LeadType::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $leadType->update($validated);
        return response()->json($leadType);
    }

    // Delete a lead type
    public function destroy($id)
    {
        $leadType = LeadType::findOrFail($id);
        $leadType->delete();
        return response()->json(['message' => 'Lead type deleted']);
    }
}
