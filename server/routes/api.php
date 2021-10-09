<?php
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\v1\AuthController;
use App\Http\Controllers\Api\v1\UserController;
use App\Http\Controllers\Api\v1\RoleController;
use App\Http\Controllers\Api\v1\PermissionController;
use App\Http\Controllers\Api\v1\ProfileController;

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
        Route::post('/',    [ProfileController::class, 'show']);
        Route::patch('/',   [ProfileController::class, 'update']);
    });
    
    Route::prefix('users')->group(function () {
        Route::get('/',             [UserController::class, 'index'])   ->middleware('permission:list_users');
        Route::post('/create',      [UserController::class, 'store'])   ->middleware('permission:create_user');
        Route::get('/{user}',       [UserController::class, 'show'])    ->middleware('permission:show_user');
        Route::patch('/{user}',     [UserController::class, 'update'])  ->middleware('permission:update_user');
        Route::delete('/{user}',    [UserController::class, 'destroy']) ->middleware('permission:delete_user');
    });
    
    Route::prefix('roles')->group(function () {
        Route::get('/',             [RoleController::class, 'index'])   ->middleware('permission:list_roles');
        Route::post('/create',      [RoleController::class, 'store'])   ->middleware('permission:create_role');
        Route::get('/{role}',       [RoleController::class, 'show'])    ->middleware('permission:show_role');
        Route::patch('/{role}',     [RoleController::class, 'update'])  ->middleware('permission:update_role');
        Route::delete('/{role}',    [RoleController::class, 'destroy']) ->middleware('permission:delete_role');
    });
    
    Route::prefix('permissions')->group(function () {
        Route::get('/',                 [PermissionController::class, 'index'])  ->middleware('permission:list_permissions');
        Route::post('/create',          [PermissionController::class, 'store'])  ->middleware('permission:create_permission');
        Route::get('/{permission}',     [PermissionController::class, 'show'])   ->middleware('permission:show_permission');
        Route::patch('/{permission}',   [PermissionController::class, 'update']) ->middleware('permission:update_permission');
        Route::delete('/{permission}',  [PermissionController::class, 'destroy'])->middleware('permission:delete_permission');
    });
});
