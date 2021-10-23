<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Http\Resources\RoleResource;
use App\Http\Requests\StoreRoleRequest;

class RoleController extends Controller
{
    public function index ()
    {
        $loggedUser = auth()->user();
        $loggedUserRole = $loggedUser->roles()->select('scope')->orderBy('scope')->first();
        $roles = Role::where('scope', '>=', $loggedUserRole->scope)->orderBy('scope', 'asc')->get();

        return RoleResource::collection($roles);
    }

    public function store (StoreRoleRequest $request):RoleResource
    {
        $role = Role::create([
            'name'          => slugify($request->name),
            'display_name'  => $request->display_name,
            'scope'         => $request->scope,
            'color'         => $request->color,
        ]);
        $role->givePermissionTo($request->permissions);
        return new RoleResource($role);
    }

    public function show (Role $role):RoleResource
    {
        return new RoleResource($role);
    }

    public function update (StoreRoleRequest $request, Role $role):RoleResource
    {
        $role->name         = slugify($request->name);
        $role->display_name = $request->display_name;
        $role->scope        = $request->scope;
        $role->color        = $request->color;
        $role->save();
        $role->syncPermissions($request->permissions);
        return new RoleResource($role);
    }

    public function destroy (Role $role):bool
    {
        $role->syncPermissions();
        $role->delete();
        return true;
    }
}
