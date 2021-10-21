<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePermissionRequest extends FormRequest
{
    /**
     * Indicates if the validator should stop on the first rule failure.
     *
     * @var bool
     */
    protected $stopOnFirstFailure = true;

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name'          => ['required', 'min:3', 'max:20', 'alpha_dash'],
            'display_name'  => ['required', 'min:3', 'max:20', 'regex:/^[\pL\s]+$/u'],
            'action'        => ['required', 'exists:App\Models\PermissionAction,id'],
            'category'      => ['required', 'exists:App\Models\PermissionCategory,id'],
            'group'         => ['nullable', 'min:1', 'max:10', 'regex:/^[\pL\s]+$/u'],
        ];
    }
}
