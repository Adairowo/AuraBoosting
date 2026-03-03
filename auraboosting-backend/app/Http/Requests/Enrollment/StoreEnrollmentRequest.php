<?php

namespace App\Http\Requests\Enrollment;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEnrollmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isStudent();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'class_id' => [
                'required',
                'exists:classes,id',
                Rule::unique('class_enrollments')->where(function ($query) {
                    return $query->where('student_id', $this->user()->id)
                                 ->whereIn('status', ['enrolled', 'attended']);
                }),
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'class_id.required' => 'La clase es requerida',
            'class_id.exists' => 'La clase no existe',
            'class_id.unique' => 'Ya estás inscrito en esta clase',
        ];
    }
}
