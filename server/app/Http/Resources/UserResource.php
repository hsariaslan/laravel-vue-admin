<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\RoleResource;
use App\Http\Resources\PermissionResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id'                => $this->id,
            'username'          => $this->username,
            'email'             => $this->email,
            'name'              => $this->name,
            'surname'           => $this->surname,
            'roles'             => RoleResource::collection($this->roles),
            'permissions'       => PermissionResource::collection($this->permissions),
            'all_permissions'   => PermissionResource::collection($this->getAllPermissions()),
        ];
    }
}
