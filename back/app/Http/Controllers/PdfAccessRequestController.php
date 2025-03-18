<?php

namespace App\Http\Controllers;

use App\Models\PdfAccessRequest;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PdfAccessRequestController extends Controller
{
    /**
     * Créer une demande d'accès au PDF pour un projet
     */
    public function createRequest($id)
    {
        $user = Auth::user();

        // Vérifier si le projet existe
        $project = Project::findOrFail($id);

        // Vérifier si une demande est déjà en attente
        $existingRequest = PdfAccessRequest::where('user_id', $user->id)
            ->where('project_id', $id)
            ->where('status', 'pending')
            ->first();

        if ($existingRequest) {
            return response()->json(['message' => 'Une demande est déjà en attente'], 400);
        }

        // Créer une nouvelle demande
        PdfAccessRequest::create([
            'user_id' => $user->id,
            'project_id' => $id,
            'status' => 'pending',
        ]);

        return response()->json(['message' => 'Demande envoyée avec succès'], 201);
    }

    /**
     * Récupérer toutes les demandes en attente pour un administrateur ou un propriétaire du projet
     */
    public function getRequests()
    {
        $user = Auth::user();
        
        // Si l'utilisateur est administrateur, il voit toutes les demandes en attente
        if ($user->role->name === 'administrator') {
            $requests = PdfAccessRequest::with('project') // Charger les projets associés
                ->where('status', 'pending')
                ->get();
            return response()->json($requests);
        }
    
        // Si l'utilisateur est d'une entreprise, il ne voit que les demandes des projets de son entreprise
        if ($user->entreprise_id) {
            $projectsOwned = Project::where('entreprise_id', $user->entreprise_id)->pluck('id');
            $requests = PdfAccessRequest::with('project') // Charger les projets associés
                ->whereIn('project_id', $projectsOwned)
                ->where('status', 'pending')
                ->get();
            return response()->json($requests);
        }
    
        // Par défaut, retourner un tableau vide si l'utilisateur n'est pas autorisé
        return response()->json([]);
    }

    /**
     * Récupérer une demande spécifique à un projet
     */    
    public function index($projectId)
    {
        $requests = PdfAccessRequest::where('project_id', $projectId)->get();
        return response()->json($requests);
    }
        

    public function requestAccess($projectId)
    {
        $user = Auth::user();
    
        // Vérifie si une demande existe déjà pour cet utilisateur et projet
        $existingRequest = PdfAccessRequest::where('user_id', $user->id)
            ->where('project_id', $projectId)
            ->whereIn('status', ['pending', 'approved'])
            ->first();
    
        if ($existingRequest) {
            return response()->json(['message' => 'Vous avez déjà une demande en attente ou approuvée pour ce projet.'], 400);
        }
    
        // Créer une nouvelle demande
        $request = new PdfAccessRequest();
        $request->user_id = $user->id;
        $request->project_id = $projectId;
        $request->status = 'pending';
        $request->save();
    
        return response()->json(['message' => 'Demande envoyée avec succès.'], 201);
    }
    

    /**
     * Approuver une demande d'accès
     */
    public function approveRequest($id, $requestId)
    {
        $user = Auth::user();
    
        // Vérifier si l'utilisateur est administrateur
        if ($user->role->name === 'administrator') { 
            $request = PdfAccessRequest::findOrFail($requestId);
            $request->status = 'approved';
            $request->save();
            return response()->json(['message' => 'Demande approuvée avec succès.']);
        }
    
        // Vérifier si l'utilisateur est propriétaire du projet
        $project = Project::findOrFail($id);
        if ($project->entreprise_id != $user->entreprise_id) {
            return response()->json(['message' => 'Accès refusé : Vous ne pouvez approuver que les demandes pour vos projets'], 403);
        }
    
        // Approuver la demande
        $request = PdfAccessRequest::findOrFail($requestId);
        $request->status = 'approved';
        $request->save();
    
        return response()->json(['message' => 'Demande approuvée avec succès.']);
    }
    

    /**
     * Rejeter une demande d'accès
     */
    public function rejectRequest($id, $requestId)
    {
        $user = Auth::user();

        // Vérifier si l'utilisateur est administrateur
        if ($user->role->name === 'administrator') {
            $request = PdfAccessRequest::findOrFail($requestId);
            $request->status = 'rejected';
            $request->save();
            return response()->json(['message' => 'Demande rejetée avec succès.']);
        }

        // Vérifier si l'utilisateur est propriétaire du projet
        $project = Project::findOrFail($id);
        if ($project->entreprise_id != $user->entreprise_id) {
            return response()->json(['message' => 'Accès refusé : Vous ne pouvez rejeter que les demandes pour vos projets'], 403);
        }

        // Rejeter la demande
        $request = PdfAccessRequest::findOrFail($requestId);
        $request->status = 'rejected';
        $request->save();

        return response()->json(['message' => 'Demande rejetée avec succès.']);
    }

}
