<?php

namespace App\Http\Controllers;

use App\Models\PdfAccessRequest;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PdfAccessRequestController extends Controller
{
    /**
     * Create a PDF access request for a project
     */
    public function createRequest($id)
    {
        $user = Auth::user();

        // Check if the project exists
        $project = Project::findOrFail($id);

        // Check if a request is already pending
        $existingRequest = PdfAccessRequest::where('user_id', $user->id)
            ->where('project_id', $id)
            ->where('status', 'pending')
            ->first();

        if ($existingRequest) {
            return response()->json(['message' => 'A request is already pending'], 400);
        }

        // Create a new request
        PdfAccessRequest::create([
            'user_id' => $user->id,
            'project_id' => $id,
            'status' => 'pending',
        ]);

        // Créer des notifications pour les propriétaires du projet
        $projectOwners = \App\Models\User::where('entreprise_id', $project->entreprise_id)->get();

        foreach ($projectOwners as $owner) {
            \App\Models\Notification::create([
                'user_id' => $owner->id,
                'message' => "Nouvelle demande d'accès PDF pour le projet '{$project->name}' par {$user->name}",
                'read' => false,
                'link' => "/projects/{$project->id}/access-requests"
            ]);
        }

        return response()->json(['message' => 'Request successfully submitted'], 201);
    }

    /**
     * Make a request for access to a project's PDF
     */
    public function requestAccess($projectId)
    {
        $user = Auth::user();

        // Check if a request already exists for this user and project
        $existingRequest = PdfAccessRequest::where('user_id', $user->id)
            ->where('project_id', $projectId)
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existingRequest) {
            return response()->json(['message' => 'You already have a pending or approved request for this project.'], 400);
        }

        // Create a new request
        $request = new PdfAccessRequest();
        $request->user_id = $user->id;
        $request->project_id = $projectId;
        $request->status = 'pending';
        $request->save();

        // Récupérer le projet
        $project = Project::findOrFail($projectId);

        // Créer des notifications pour les propriétaires du projet
        $projectOwners = \App\Models\User::where('entreprise_id', $project->entreprise_id)->get();

        foreach ($projectOwners as $owner) {
            \App\Models\Notification::create([
                'user_id' => $owner->id,
                'message' => "Nouvelle demande d'accès PDF pour le projet '{$project->name}' par {$user->name}",
                'read' => false,
                'link' => "/projects/{$project->id}/access-requests"
            ]);
        }

        return response()->json(['message' => 'Request successfully submitted.'], 201);
    }

    /**
     * Get all pending requests for an admin or project owner
     */
    public function getRequests()
    {
        $user = Auth::user();

        // If user is an administrator, return all pending requests
        if ($user->role->name === 'administrator') {
            $requests = PdfAccessRequest::with('project') // Load related projects
            ->where('status', 'pending')
                ->get();
            return response()->json($requests);
        }

        // If user is part of a company, return only requests for their company's projects
        if ($user->entreprise_id) {
            $projectsOwned = Project::where('entreprise_id', $user->entreprise_id)->pluck('id');
            $requests = PdfAccessRequest::with('project') // Load related projects
            ->whereIn('project_id', $projectsOwned)
                ->where('status', 'pending')
                ->get();
            return response()->json($requests);
        }

        // By default, return an empty array if user is not authorized
        return response()->json([]);
    }

    /**
     * Get all requests for a specific project
     */
    public function index($projectId)
    {
        $requests = PdfAccessRequest::where('project_id', $projectId)->get();
        return response()->json($requests);
    }

    /**
     * Approve an access request
     */
    public function approveRequest($id, $requestId)
    {
        $user = Auth::user();

        // Check if the user is an administrator
        if ($user->role->name === 'administrator') {
            $request = PdfAccessRequest::findOrFail($requestId);
            $request->status = 'approved';
            $request->save();
            return response()->json(['message' => 'Request successfully approved.']);
        }

        // Check if the user is the owner of the project
        $project = Project::findOrFail($id);
        if ($project->entreprise_id != $user->entreprise_id) {
            return response()->json(['message' => 'Access denied: You can only approve requests for your own projects'], 403);
        }

        // Approve the request
        $request = PdfAccessRequest::findOrFail($requestId);
        $request->status = 'approved';
        $request->save();

        // Créer une notification pour l'utilisateur dont la demande a été approuvée
        \App\Models\Notification::create([
            'user_id' => $request->user_id,
            'message' => "Votre demande d'accès au PDF pour le projet '{$project->name}' a été approuvée",
            'read' => false,
            'link' => "/projects/{$id}/reports"
        ]);

        return response()->json(['message' => 'Request successfully approved.']);
    }

    /**
     * Reject an access request
     */
    public function rejectRequest($id, $requestId)
    {
        $user = Auth::user();

        // Check if the user is an administrator
        if ($user->role->name === 'administrator') {
            $request = PdfAccessRequest::findOrFail($requestId);
            $request->status = 'rejected';
            $request->save();
            return response()->json(['message' => 'Request successfully rejected.']);
        }

        // Check if the user is the owner of the project
        $project = Project::findOrFail($id);
        if ($project->entreprise_id != $user->entreprise_id) {
            return response()->json(['message' => 'Access denied: You can only reject requests for your own projects'], 403);
        }

        // Reject the request
        $request = PdfAccessRequest::findOrFail($requestId);
        $request->status = 'rejected';
        $request->save();

        // Créer une notification pour l'utilisateur dont la demande a été rejetée
        \App\Models\Notification::create([
            'user_id' => $request->user_id,
            'message' => "Votre demande d'accès au PDF pour le projet '{$project->name}' a été rejetée",
            'read' => false,
            'link' => "/projects/{$id}/reports"
        ]);

        return response()->json(['message' => 'Request successfully rejected.']);
    }
}