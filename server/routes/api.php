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
});
Route::prefix('profile')->group(function () {
    Route::post('/',    [ProfileController::class, 'show']);
    Route::patch('/',   [ProfileController::class, 'update']);
});

Route::prefix('users')->group(function () {
    Route::get('/',             [UserController::class, 'index']);
    Route::post('/create',      [UserController::class, 'store']);
    Route::get('/{user}',       [UserController::class, 'show']);
    Route::patch('/{user}',     [UserController::class, 'update']);
    Route::delete('/{user}',    [UserController::class, 'destroy']);
});

Route::prefix('roles')->group(function () {
    Route::get('/',             [RoleController::class, 'index']);
    Route::post('/create',      [RoleController::class, 'store']);
    Route::get('/{role}',       [RoleController::class, 'show']);
    Route::patch('/{role}',     [RoleController::class, 'update']);
    Route::delete('/{role}',    [RoleController::class, 'destroy']);
});

Route::prefix('permissions')->group(function () {
    Route::get('/',                 [PermissionController::class, 'index']);
    Route::post('/create',          [PermissionController::class, 'store']);
    Route::get('/{permission}',     [PermissionController::class, 'show']);
    Route::patch('/{permission}',   [PermissionController::class, 'update']);
    Route::delete('/{permission}',  [PermissionController::class, 'destroy']);
});
