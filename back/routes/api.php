<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\UpgradeRequestController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EntrepriseController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\PdfAccessRequestController;


Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/deleteUser', [AuthController::class, 'deleteAccount']);
    Route::post('/upgradeRequete', [UpgradeRequestController::class, 'store']);
    
});
Route::post('/register', [AuthController::class, 'register']);
Route::get('/entreprises', [EntrepriseController::class, 'index']);
Route::get('/secure-data', function (Request $request) {
    return response()->json([
        'message' => 'Accès autorisé !',
        'user' => $request->user(),
    ]);
})->middleware('auth:sanctum');


Route::middleware(['auth:sanctum', 'checkEntrepriseRole', 'checkPermission:canDelete'])
    ->get('/test', function () {
        return response()->json([
            'message' => 'Accès autorisé, vous avez les bonnes permissions et rôle pour créer un projet.',
            'status' => 'success'
        ]);
    });

// Route protégée par Sanctum (nécessite une authentification)
Route::middleware('auth:sanctum')->get('/test-auth', function (Request $request) {
    return response()->json(['message' => 'Connexion réussie avec authentification Sanctum!']);
});

Route::middleware(['permission:manage_users'])->get('/test-permission', function () {
    return response()->json(['message' => 'Accès autorisé']);
});

Route::middleware(['auth:sanctum', 'checkAdminRole'])->group(function () {
    Route::get('/roles', [AdminController::class, 'getRoles']);
    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::put('/users/{id}/role', [AdminController::class, 'updateUserRole']);
    Route::get('/roles/{id}/permissions', [AdminController::class, 'getPermissions']);
    Route::put('/roles/{id}/permissions', [AdminController::class, 'updateRolePermissions']);
});


//Path for the project management requests
Route::get('/projects', [ProjectController::class, 'index']); // List of available projects
Route::middleware(['auth:sanctum', 'checkPermission:canCreate'])->post('/projects', [ProjectController::class, 'store']); // Create a project
Route::middleware(['auth:sanctum', 'checkAdminRole', 'checkPermission:canUpdate'])->put('/projects/{id}', [ProjectController::class, 'update']); // Update a project
Route::middleware(['auth:sanctum', 'checkAdminRole', 'checkPermission:canDelete'])->delete('/projects/{id}', [ProjectController::class, 'destroy']); // Delete a project

Route::get('/reports/file/{filename}', [ReportController::class, 'getReportFile']);
Route::post('/upload', [ReportController::class, 'upload']);

//Path for the project access requests
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/projects/access-requests', [PdfAccessRequestController::class, 'getRequests']);
    Route::get('/projects/{id}/access-requests', [PdfAccessRequestController::class, 'index']);
    Route::get('/projects/{id}/reports', [ReportController::class, 'getReports'])->middleware('auth:sanctum');
    Route::post('/projects/{id}/access-requests', [PdfAccessRequestController::class, 'createRequest']);
    Route::post('/projects/{id}/access-requests/{requestId}/approve', [PdfAccessRequestController::class, 'approveRequest']);
    Route::post('/projects/{id}/access-requests/{requestId}/reject', [PdfAccessRequestController::class, 'rejectRequest']);
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