<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CountryController extends Controller
{
    public function index()
    {
        // Fetch all countries from the database
        $countries = Country::all();

        // Return the view with the countries data
        return view('countries.index', compact('countries'));
    }
    
    public function getCountries()
    {
        // Fetch all countries from the database
        $countries = Country::all();

        // Return the countries as a JSON response
        return response()->json($countries);
    }
    
    public function getCountry($id)
    {
        // Fetch the country by ID
        $country = Country::findOrFail($id);

        // Return the country as a JSON response
        return response()->json($country);
    }
    
    public function getCountryByCode($code)
    {
        // Fetch the country by code
        $country = Country::where('code', $code)->firstOrFail();

        // Return the country as a JSON response
        return response()->json($country);
    }
}
