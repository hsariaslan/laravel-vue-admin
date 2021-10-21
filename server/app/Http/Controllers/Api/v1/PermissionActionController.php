<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\PermissionAction;
use App\Http\Resources\PermissionActionResource;
use App\Http\Requests\StorePermissionActionRequest;

class PermissionActionController extends Controller
{
    public function index()
    {
        return PermissionActionResource::collection(PermissionAction::all());
    }

    public function store(StorePermissionActionRequest $request): PermissionActionResource
    {
        $permission = PermissionAction::create([
            'name' => $request->name,
        ]);

        return new PermissionActionResource($permission);
    }

    public function update(StorePermissionActionRequest $request, PermissionAction $permissionAction): PermissionActionResource
    {
        $permissionAction->name = $request->name;
        $permissionAction->save();
        
        return new PermissionActionResource($permissionAction);
    }

    public function destroy(PermissionAction $permissionAction): bool
    {
        $permissionAction->delete();

        return true;
    }
}
