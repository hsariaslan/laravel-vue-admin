<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasRoles, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'name',
        'surname',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

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
