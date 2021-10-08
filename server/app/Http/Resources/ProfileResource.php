<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Permission;

class ProfileResource extends JsonResource
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
            'username'      => apiCrypt($this->username),
            'email'         => apiCrypt($this->email),
            'name'          => apiCrypt($this->name),
            'surname'       => apiCrypt($this->surname),
            'roles'         => apiCrypt(json_encode((array)Auth::user()->getRolesNamesAndColor())),
            'permissions'   => $this->when(
                Auth::user()->isAdmin(), function () {
                    return apiCrypt(Permission::all()->pluck('name'));
                }, function() {
                    return apiCrypt($this->getAllPermissions()->pluck('name'));
                }),
        ];
    }
}
