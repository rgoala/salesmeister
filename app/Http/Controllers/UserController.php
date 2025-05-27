<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        // Fetch all users from the database
        $users = User::all();

        // Return the view with the users data
        return view('users.index', compact('users'));
    }

    public function edit($id)
    {
        // Fetch the user by ID
        $user = User::findOrFail($id);

        // Show the form to edit the user
        return view('users.edit', compact('user'));
    }

    public function update(Array $request, $id)
    {
        // Validate and update the user data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'required|string|in:admin,user',
        ]);
        

        $user = User::findOrFail($id);
        $user->update($arrData);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }
}
