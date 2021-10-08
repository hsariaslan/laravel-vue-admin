<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Models\Profile;
use App\Http\Resources\ProfileResource;
use App\Http\Requests\StoreUserRequest;

class ProfileController extends Controller
{
    public function show()
    {
        $user = auth()->user();
        return new ProfileResource($user);
    }

    public function update(StoreUserRequest $request, Profile $profile):ProfileResource
    {
        $profile->username  = $request->username;
        $profile->email     = $request->email;
        $profile->password  = Hash::make($request->password);
        $profile->name      = $request->name;
        $profile->surname   = $request->surname;
        $profile->syncRoles($request->roles);
        $profile->syncPermissions($request->permissions);
        $profile->save();
        return new ProfileResource($profile);
    }
}
