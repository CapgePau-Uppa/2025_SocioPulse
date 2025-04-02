<?php

use App\Http\Controllers\AvailabilitieController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\UpgradeRequestController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EntrepriseController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\PdfAccessRequestController;
use App\Http\Controllers\RendezVousController;

/*
* Middleware:
* - 'auth:sanctum': Ensures the user is authenticated via Sanctum.
* - 'checkAdminRole': Ensures the user has an admin role.
* - 'checkCommunauteRole': Ensures the user has a community role.
* - 'checkEntrepriseRole': Ensures the user has an enterprise role.
*/

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/deleteUser', [AuthController::class, 'deleteAccount']);
    Route::post('/upgradeRequete', [UpgradeRequestController::class, 'store']);
    
});

/**
 * API Routes to register a new user, to get the list of entreprises, to get secure data.
 */
Route::post('/register', [AuthController::class, 'register']);
Route::get('/entreprises', [EntrepriseController::class, 'index']);
Route::get('/secure-data', function (Request $request) {
    return response()->json([
        'message' => 'Accès autorisé !',
        'user' => $request->user(),
    ]);
})->middleware('auth:sanctum');


/**
 * API Routes for Admin functionalities.
 */
Route::middleware(['auth:sanctum', 'checkAdminRole'])->group(function () {
    Route::get('/roles', [AdminController::class, 'getRoles']);
    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::put('/users/{id}/role', [AdminController::class, 'updateUserRole']);
    Route::get('/roles/{id}/permissions', [AdminController::class, 'getPermissions']);
    Route::put('/roles/{id}/permissions', [AdminController::class, 'updateRolePermissions']);
});


/**
 * API Routes for Project Management requests
 */
Route::get('/projects', [ProjectController::class, 'index']); // List of available projects

Route::middleware(['auth:sanctum', 'checkPermission:canCreate'])
    ->post('/projects', [ProjectController::class, 'store']); // Create a project

Route::middleware(['auth:sanctum', 'checkAdminRole', 'checkPermission:canUpdate'])
    ->put('/projects/{id}', [ProjectController::class, 'update']); // Update a project

Route::middleware(['auth:sanctum', 'checkAdminRole', 'checkPermission:canDelete'])
    ->delete('/projects/{id}', [ProjectController::class, 'destroy']); // Delete a project


/**
 * Route to get a report file by filename and to upload.
 */
Route::get('/reports/file/{filename}', [ReportController::class, 'getReportFile']);
Route::post('/upload', [ReportController::class, 'upload']);

/**
 * API Routes for the project access requests
 */
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/projects/access-requests', [PdfAccessRequestController::class, 'getRequests']);
    Route::get('/projects/{id}/access-requests', [PdfAccessRequestController::class, 'index']);
    Route::get('/projects/{id}/reports', [ReportController::class, 'getReports'])->middleware('auth:sanctum');
    Route::post('/projects/{id}/access-requests', [PdfAccessRequestController::class, 'createRequest']);
    Route::post('/projects/{id}/access-requests/{requestId}/approve', [PdfAccessRequestController::class, 'approveRequest']);
    Route::post('/projects/{id}/access-requests/{requestId}/reject', [PdfAccessRequestController::class, 'rejectRequest']);
    Route::put('/projects/{id}', [ProjectController::class, 'update']);
});


/**
 * API Routes for managing "Rendez-Vous" (appointments) within projects.
 */
Route::middleware(['auth:sanctum', 'checkRole:administrator,communaute,entreprise'])
    ->get('/projects/{id}/rendez-vous', [RendezVousController::class, 'index']);

Route::get('/projects/{project}/rendez-vous/{date}', [RendezVousController::class, 'getRendezVousForDate']);

// Une collectivité peut modifier/supprimer ses propres rendez-vous
Route::middleware(['auth:sanctum', 'checkRole:administrator,communaute'])
    ->put('/projects/{id}/rendez-vous', [RendezVousController::class, 'update']);
    
Route::middleware(['auth:sanctum', 'checkRole:administrator,communaute'])
    ->delete('/projects/{id}/rendez-vous', [RendezVousController::class, 'destroy']);

// Une entreprise peut accepter ou refuser un rendez-vous
Route::middleware(['auth:sanctum', 'checkRole:administrator,entreprise'])
    ->post('/projects/rendez-vous/{id}/accept', [RendezVousController::class, 'accept']);
    
Route::middleware(['auth:sanctum', 'checkRole:administrator,entreprise'])
    ->post('/projects/rendez-vous/{id}/reject', [RendezVousController::class, 'reject']);

Route::middleware(['auth:sanctum', 'checkRole:administrator,communaute,entreprise'])
->post('/projects/{id}/rendez-vous', [RendezVousController::class, 'store']);



/**
 * API Routes for Availabilities management within projects.
 * This allows an enterprise to manage its availability for a specific project.
 */
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/availabilities/{projectId}', [AvailabilitieController::class, 'index']);
    Route::post('/availabilities/{projectId}', [AvailabilitieController::class, 'store']);
});


/*
// Route protégée par Sanctum  et permissions administrator
Route::middleware(['auth:sanctum', 'permission:manage_users'])->get('/test-middleware', function () {
    return response()->json(['message' => 'Accès autorisé au middleware avec permissions admin'], 200);
});
*/

/*
Route::middleware('auth:sanctum')->get('/secure-data', function (Request $request) {
    return response()->json([
        'message' => 'Accès autorisé !',
        'user' => $request->user(),
    ]);
});*/

//route pour le CSRF cookie
//Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);

/*
Route::post('/login', function (Request $request) {
    print("Passage dans login");
    return response()->json(['message' => 'Authentification en cours...']);
})->withoutMiddleware([\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class]);
*/