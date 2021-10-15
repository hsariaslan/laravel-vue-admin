<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRoleRequest extends FormRequest
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
            'name'          => ['required', Rule::unique('roles')->ignore($this->role), 'min:3', 'max:20', 'alpha_dash'],
            'display_name'  => ['required', Rule::unique('roles')->ignore($this->role), 'min:3', 'max:20', 'regex:/^[\pL\s]+$/u'],
            'color'         => ['required', 'size:8', 'alpha_num'],
            'permissions'   => ['required', 'array', 'exists:Spatie\Permission\Models\Permission,id']
        ];
    }
}
