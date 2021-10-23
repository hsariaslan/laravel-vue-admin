<?php

namespace App\Models\Traits;

use Illuminate\Support\Str;

Trait HasUuid
{
  protected static function bootHasUuid()
  {
      static::creating(function($model) {
          $model->uuid = Str::uuid();
      });
  }
}