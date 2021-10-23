<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Role as RoleModel;
use App\Models\Traits\HasUuid;

class Role extends RoleModel
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'uuid',
        'name',
        'display_name',
        'color',
        'scope',
        'guard_name',
    ];
	
	public function getRouteKeyName()
	{
		return 'uuid';
	}
}
