<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Permission as PermissionModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\PermissionCategory;
use App\Models\PermissionAction;

class Permission extends PermissionModel
{
    use HasFactory;

    /**
     * A permission belongs to a permission category.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(PermissionCategory::class);
    }

    /**
     * A permission belongs to a permission action.
     */
    public function action(): BelongsTo
    {
        return $this->belongsTo(PermissionAction::class);
    }
}
