<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\PermissionAction;
use App\Models\PermissionCategory;

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
            'name'          => ['required', Rule::unique('permissions')->ignore($this->permission), 'min:3', 'max:20', 'alpha_dash'],
            'display_name'  => ['required', Rule::unique('permissions')->ignore($this->permission), 'min:3', 'max:20', 'regex:/^[\pL\s]+$/u'],
            'action'        => ['required', 'exists:App\Models\PermissionAction,id'],
            'category'      => ['required', 'exists:App\Models\PermissionCategory,id'],
            'group'         => ['nullable', 'min:1', 'max:10', 'regex:/^[\pL\s]+$/u'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'action' => PermissionAction::select('id')->where('uuid', $this->action)->first()->id,
            'category' => PermissionCategory::select('id')->where('uuid', $this->category)->first()->id,
        ]);
    }
}
