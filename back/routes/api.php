<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Middleware\CheckPermission;
use App\Http\Middleware\CheckEntrepriseRole;
use App\Http\Middleware\CheckCitoyenRole;
use App\Http\Middleware\CheckCommunauteRole;
use App\Http\Middleware\CheckAdminRole;
use App\Http\Controllers\UpgradeRequestController;

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/deleteUser', [AuthController::class, 'deleteAccount']);
    Route::post('/upgradeRequete', [UpgradeRequestController::class, 'store']);
    
});
Route::post('/register', [AuthController::class, 'register']);


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
/*
// Route protégée par Sanctum  et permissions administrator
Route::middleware(['auth:sanctum', 'permission:manage_users'])->get('/test-middleware', function () {
    return response()->json(['message' => 'Accès autorisé au middleware avec permissions admin'], 200);
});
*/
Route::middleware(['permission:manage_users'])->get('/test-permission', function () {
    return response()->json(['message' => 'Accès autorisé']);
});

/**
 * API Routes for managing roles and permissions.
 * 
 * These routes are protected by 'auth:sanctum' and 'permission:admin' middleware.
 * 
 * Controllers:
 * - RoleController: Handles role-related actions.
 * - UserController: Handles user-related actions.
 */
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('/roles/{roleId}/assign-permission', [RoleController::class, 'assignPermission']);
    Route::post('/roles/{roleId}/remove-permission', [RoleController::class, 'removePermission']);

    Route::post('/users/{userId}/assign-role', [UserController::class, 'assignRole']);
    Route::post('/users/{userId}/remove-role', [UserController::class, 'removeRole']);
});

//Path for the project requests
Route::get('/projects', [ProjectController::class, 'index']); // List of available projects
Route::/*middleware('auth:sanctum')->*/post('/projects', [ProjectController::class, 'store']); // Create a project
Route::middleware('auth:sanctum')->put('/projects/{id}', [ProjectController::class, 'update']); // Update a project
Route::middleware('auth:sanctum')->delete('/projects/{id}', [ProjectController::class, 'destroy']); // Delete a project

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