<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Permission;

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
            'scope'         => ['required', 'numeric', 'min:1', 'max:255'],
            'color'         => ['required', 'size:8', 'alpha_num'],
            'permissions'   => ['required', 'array', 'exists:App\Models\Permission,id']
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $permissions = [];
        foreach($this->permissions as $permission) {
            $permissions[] = Permission::select('id')->where('uuid', $permission)->first()->id;
        }

        $this->merge([
            'permissions' => $permissions
        ]);
    }
}
