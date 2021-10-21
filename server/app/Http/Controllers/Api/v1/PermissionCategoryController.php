<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\PermissionCategory;
use App\Http\Resources\PermissionCategoryResource;
use App\Http\Requests\StorePermissionCategoryRequest;

class PermissionCategoryController extends Controller
{
    public function index()
    {
        return PermissionCategoryResource::collection(PermissionCategory::all());
    }

    public function store(StorePermissionCategoryRequest $request): PermissionCategoryResource
    {
        $permission = PermissionCategory::create([
            'name' => $request->name,
        ]);

        return new PermissionCategoryResource($permission);
    }

    public function update(StorePermissionCategoryRequest $request, PermissionCategory $permissionCategory): PermissionCategoryResource
    {
        $permissionCategory->name = $request->name;
        $permissionCategory->save();
        
        return new PermissionCategoryResource($permissionCategory);
    }

    public function destroy(PermissionCategory $permissionCategory): bool
    {
        $permissionCategory->delete();

        return true;
    }
}
