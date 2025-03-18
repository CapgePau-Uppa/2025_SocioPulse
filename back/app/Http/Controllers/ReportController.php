<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Report; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

class ReportController extends Controller
{
    public function getReportFile($filename)
    {
        $path = storage_path("../../ressource/$filename"); // Chemin du fichier
    
        if (!File::exists($path)) {
            return response()->json(['error' => 'Fichier non trouvé'], 404);
        }
    
        return Response::file($path);
    }

    public function upload(Request $request)
    {
        // Validation des données reçues (nom, fichier et ID du projet)
        $request->validate([
            'name' => 'required|string|max:255',
            'file' => 'required|mimes:pdf|max:2048',            
            'project_id' => 'required|integer|exists:projects,id',  // Vérifie l'ID du projet
        ]);

        // Vérifie si un fichier a été envoyé
        if (!$request->hasFile('file')) {
            return response()->json(['error' => 'Aucun fichier reçu'], 400);
        }

        $file = $request->file('file');
        $name = $request->input('name'); // Nom du rapport
        $projectId = $request->input('project_id');  // Récupère l'ID du projet

        // Vérification du type de fichier (uniquement PDF)
        if ($file->getClientOriginalExtension() !== 'pdf') {
            return response()->json(['error' => 'Seuls les fichiers PDF sont autorisés'], 400);
        }

        // Vérifie si le projet existe
        $project = Project::find($projectId);
        if (!$project) {
            return response()->json(['error' => 'Projet non trouvé'], 404);
        }

        // Générer un nom unique pour éviter les conflits
        $fileName = time() . '-' . $file->getClientOriginalName();

        // Déplacer le fichier dans `ressource/`
        $path = storage_path('../../ressource/');
        $file->move($path, $fileName);

        // Créer et enregistrer le rapport en utilisant la méthode create()
        $report = Report::create([
            'name' => $name,  // Nom du rapport
            'path' => "../../ressource/$fileName",  // Le chemin du fichier
 // Chemin complet du fichier
            'project_id' => $projectId,  // ID du projet
        ]);

        // Retourner le chemin pour l’enregistrement en base de données
        return response()->json(['path' => "../../ressource/$fileName"], 200);
    }

    public function getReports()
    {
        $reports = Report::with('project')->get();

        return response()->json($reports, 200);
    }

}
