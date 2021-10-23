<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\PermissionActionResource;
use App\Http\Resources\PermissionCategoryResource;

class PermissionResource extends JsonResource
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
            'uuid'          => $this->uuid,
            'name'          => $this->name,
            'display_name'  => $this->display_name,
            'action'        => new PermissionActionResource($this->action),
            'category'      => new PermissionCategoryResource($this->category),
            'group'         => $this->group,
        ];
    }
}
