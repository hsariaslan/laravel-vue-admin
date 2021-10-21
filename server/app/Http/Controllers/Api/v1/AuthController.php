<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\ProfileResource;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login (LoginRequest $request)
    {
        if (Auth::attempt($request->validated())) {
            $request->session()->regenerate();
            $user = auth()->user();
            return new ProfileResource($user);
        }

        return response(['message' => 'Email or password is wrong'], 401);
    }

    public function logout()
    {
        Auth::logout();

        return response(['message' => 'Logged out'], 200);
    }
}
