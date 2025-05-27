<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CityController extends Controller
{
    public function index()
    {
        // Fetch all cities from the database
        $cities = City::all();

        // Return the cities as a JSON response
        return response()->json($cities);
    }

    public function show($id)
    {
        // Find a city by its ID
        $city = City::find($id);

        // If the city is not found, return a 404 response
        if (!$city) {
            return response()->json(['message' => 'City not found'], 404);
        }

        // Return the city as a JSON response
        return response()->json($city);
    }
    public function store(Request $request)
    {
        // Validate the request data
        $request->validate([
            'name' => 'required|string|max:255',
            'state_id' => 'required|exists:states,id',
            'country_id' => 'required|exists:countries,id',
        ]);

        // Create a new city
        $city = City::create($request->all());

        // Return the created city as a JSON response
        return response()->json($city, 201);
    }
    public function update(Request $request, $id)
    {
        // Find the city by its ID
        $city = City::find($id);

        // If the city is not found, return a 404 response
        if (!$city) {
            return response()->json(['message' => 'City not found'], 404);
        }

        // Validate the request data
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'state_id' => 'sometimes|required|exists:states,id',
            'country_id' => 'sometimes|required|exists:countries,id',
        ]);

        // Update the city
        $city->update($request->all());

        // Return the updated city as a JSON response
        return response()->json($city);
    }
    public function destroy($id)
    {
        // Find the city by its ID
        $city = City::find($id);

        // If the city is not found, return a 404 response
        if (!$city) {
            return response()->json(['message' => 'City not found'], 404);
        }

        // Delete the city
        $city->delete();

        // Return a success message
        return response()->json(['message' => 'City deleted successfully']);
    }
}
