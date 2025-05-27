<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index()
    {
        // Fetch all comments from the database
        $comments = Comment::all();

        // Return the comments as a JSON response
        return response()->json($comments);
    }

    public function show($id)
    {
        // Find a comment by its ID
        $comment = Comment::find($id);

        // If the comment is not found, return a 404 response
        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        // Return the comment as a JSON response
        return response()->json($comment);
    }
    public function store(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'lead_id' => 'required|exists:leads,id',
            'task_id' => 'nullable|exists:tasks,id',
            'step_id' => 'nullable|exists:steps,id',
            'comment' => 'required|string|max:1000',
            'created_by' => 'required|exists:users,id',
        ]);

        // Create a new comment
        $comment = Comment::create($validatedData);

        // Return the created comment as a JSON response
        return response()->json($comment, 201);
    }
    public function update(Request $request, $id)
    {
        // Find the comment by its ID
        $comment = Comment::find($id);

        // If the comment is not found, return a 404 response
        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        // Validate the incoming request data
        $validatedData = $request->validate([
            'lead_id' => 'required|exists:leads,id',
            'task_id' => 'nullable|exists:tasks,id',
            'step_id' => 'nullable|exists:steps,id',
            'comment' => 'required|string|max:1000',
            'created_by' => 'required|exists:users,id',
        ]);

        // Update the comment with the validated data
        $comment->update($validatedData);

        // Return the updated comment as a JSON response
        return response()->json($comment);
    }
    public function destroy($id)
    {
        // Find the comment by its ID
        $comment = Comment::find($id);

        // If the comment is not found, return a 404 response
        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        // Delete the comment
        $comment->delete();

        // Return a success message
        return response()->json(['message' => 'Comment deleted successfully']);
    }
    public function getCommentsByLeadId($leadId)
    {
        // Fetch comments by lead ID
        $comments = Comment::where('lead_id', $leadId)->get();

        // Return the comments as a JSON response
        return response()->json($comments);
    }
    public function getCommentsByTaskId($taskId)
    {
        // Fetch comments by task ID
        $comments = Comment::where('task_id', $taskId)->get();

        // Return the comments as a JSON response
        return response()->json($comments);
    }
    public function getCommentsByStepId($stepId)
    {
        // Fetch comments by step ID
        $comments = Comment::where('step_id', $stepId)->get();

        // Return the comments as a JSON response
        return response()->json($comments);
    }
    public function getCommentsByCreatedBy($userId)
    {
        // Fetch comments by created by user ID
        $comments = Comment::where('created_by', $userId)->get();

        // Return the comments as a JSON response
        return response()->json($comments);
    }
}
