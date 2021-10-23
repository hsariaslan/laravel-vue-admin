<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Role;
use App\Models\Permission;

class StoreUserRequest extends FormRequest
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
        // return $this->user()->can('update_user', $this->user);
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
            'username'              => ['required', Rule::unique('users')->ignore($this->user), 'min:5', 'max:20'],
            'email'                 => ['required', Rule::unique('users')->ignore($this->user), 'min:6', 'max:50', 'email:rfc,dns,spoof'],
            'password'              => ['sometimes', 'required', 'min:6', 'max:20', 'confirmed'],
            'password_confirmation' => ['sometimes', 'required', 'same:password'],
            'name'                  => ['required', 'min:3', 'max:20', 'alpha'],
            'surname'               => ['required', 'min:3', 'max:20', 'alpha'],
            'roles'                 => ['required', 'array', 'exists:Spatie\Permission\Models\Role,id'],
            'permissions'           => ['nullable', 'array', 'exists:App\Models\Permission,id']
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $roles = [];
        $permissions = [];
        
        foreach($this->roles as $role) {
            $roles[] = Role::select('id')->where('uuid', $role)->first()->id;
        }

        foreach($this->permissions as $permission) {
            $permissions[] = Permission::select('id')->where('uuid', $permission)->first()->id;
        }

        $this->merge([
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }

    /**
     * Get the validation messages that apply to the request.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'email.email' => 'The email must be a real email address.',
        ];
    }
}
