<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Traits\HasUuid;

class PermissionAction extends Model
{
    use HasFactory, HasUuid;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'uuid',
        'name',
    ];
	
	public function getRouteKeyName()
	{
		return 'uuid';
	}


    /**
     * A action may be given various permissions.
     */
    public function permissions(): HasMany
    {
        return $this->hasMany(config('permission.models.permission'));
    }
}
