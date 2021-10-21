<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Http\Resources\PermissionResource;
use App\Http\Requests\StorePermissionRequest;

class PermissionController extends Controller
{
    public function index ()
    {
        return PermissionResource::collection(Permission::all());
    }

    public function store (StorePermissionRequest $request):PermissionResource
    {
        $permission = Permission::create([
            'name'          => slugify($request->name),
            'display_name'  => $request->display_name,
            'action_id'     => $request->action,
            'category_id'   => $request->category,
            'group'         => $request->group,
            'guard'         => 'web',
        ]);

        return new PermissionResource($permission);
    }

    public function show (Permission $permission):PermissionResource
    {
        return new PermissionResource($permission);
    }

    public function update (StorePermissionRequest $request, Permission $permission):PermissionResource
    {
        $permission->name           = slugify($request->name);
        $permission->display_name   = $request->display_name;
        $permission->action_id      = $request->action;
        $permission->category_id    = $request->category;
        $permission->group          = $request->group;
        $permission->save();
        
        return new PermissionResource($permission);
    }

    public function destroy (Permission $permission):bool
    {
        $permission->delete();

        return true;
    }
}
