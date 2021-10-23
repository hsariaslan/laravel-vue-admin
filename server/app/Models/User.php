<?php

namespace App\Models;

use App\Models\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasRoles, HasUuid, Notifiable;

    protected $fillable = [
        'uuid',
        'username',
        'email',
        'password',
        'name',
        'surname',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
	
	public function getRouteKeyName()
	{
		return 'uuid';
	}

    public function isAdmin()
    {
        return $this->roles()->where('name', 'admin')->exists();
    }

    public function getUserRoles()
    {
        $roles = [];
        $i = 0;

        foreach($this->roles()->orderBy('scope')->get() as $role) {
            $roles[$i] = [
                $role->id,
                $role->name,
                $role->display_name,
                $role->color,
                $role->scope
            ];
            $i ++;
        }

        return $roles;
    }

    public function getUserPermissions()
    {
        $permissions = [];
        $i = 0;

        foreach($this->permissions()->get() as $permission) {
            $permissions[$i] = [
                $permission->id,
                $permission->name,
                $permission->display_name
            ];
            $i ++;
        }

        return $permissions;
    }
}
