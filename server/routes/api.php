<?php
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\v1\AuthController;
use App\Http\Controllers\Api\v1\ProfileController;
use App\Http\Controllers\Api\v1\UserController;
use App\Http\Controllers\Api\v1\RoleController;
use App\Http\Controllers\Api\v1\PermissionController;
use App\Http\Controllers\Api\v1\PermissionCategoryController;
use App\Http\Controllers\Api\v1\PermissionActionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['middleware' => ['web']], function () {
    Route::post('/login',   [AuthController::class, 'login']);
    Route::post('/logout',  [AuthController::class, 'logout']);
});

Route::middleware('auth:sanctum')->group(function () {
    
    Route::prefix('profile')->group(function () {
        Route::get('/',     [ProfileController::class, 'show']);
        Route::patch('/',   [ProfileController::class, 'update']);
    });
    
    Route::apiResource('users', UserController::class);
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('permissions', PermissionController::class);
    Route::apiResource('permission-categories', PermissionCategoryController::class);
    Route::apiResource('permission-actions', PermissionActionController::class);
});
