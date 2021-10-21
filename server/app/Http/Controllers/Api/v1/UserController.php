<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Http\Resources\UserResource;
use App\Http\Requests\StoreUserRequest;

class UserController extends Controller
{
    public function index ()
    {
        $users = User::whereHas('roles', function ($query) {
            $loggedUser = auth()->user();
            $loggedUserRoles = $loggedUser->roles->sortBy('scope');
            $loggedUserScope = $loggedUserRoles[0]->scope;
            return $query->where('scope', '>=', $loggedUserScope);
        })->get();

        return UserResource::collection($users);
    }

    public function store (StoreUserRequest $request):UserResource
    {
        $user = User::create([
            'username'  => $request->username,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'name'      => $request->name,
            'surname'   => $request->surname,
        ]);
        $user->assignRole($request->roles);
        $user->givePermissionTo($request->permissions);

        return new UserResource($user);
    }

    public function show (User $user):UserResource
    {
        return new UserResource($user);
    }

    public function update (StoreUserRequest $request, User $user)
    {
        $loggedUser = auth()->user();
        $loggedUserRoles = $loggedUser->roles->sortBy('scope');
        $loggedUserScope = $loggedUserRoles[0]->scope;
        $userRoles = $user->roles->sortBy('scope');
        $userScope = $userRoles[0]->scope;

        if($loggedUserScope < $userScope) {
            $user->username = $request->username;
            $user->email    = $request->email;
            $user->name     = $request->name;
            $user->surname  = $request->surname;
            
            if(!is_null($request->password)) {
                $user->password = Hash::make($request->password);
            }
            
            $user->syncRoles($request->roles);
            $user->syncPermissions($request->permissions);
            $user->save();

            return new UserResource($user);
        } else {
            return response(['message' => 'Forbidden'], 403);
        }
    }

    public function destroy (User $user)
    {
        $loggedUser = auth()->user();
        $loggedUserRoles = $loggedUser->roles->sortBy('scope');
        $loggedUserScope = $loggedUserRoles[0]->scope;
        $userRoles = $user->roles->sortBy('scope');
        $userScope = $userRoles[0]->scope;

        if($loggedUserScope < $userScope) {
            $user->syncRoles();
            $user->syncPermissions();
            $user->delete();

            return true;
        } else {
            return response(['message' => 'Forbidden'], 403);
        }
    }
}
