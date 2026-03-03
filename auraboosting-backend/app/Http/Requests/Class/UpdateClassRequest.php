<?php

namespace App\Http\Requests\Class;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClassRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isCoach();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'duration' => ['sometimes', 'integer', 'min:15', 'max:480'],
            'price' => ['sometimes', 'numeric', 'min:0', 'max:999999.99'],
            'max_students' => ['sometimes', 'integer', 'min:1', 'max:50'],
            'scheduled_at' => ['sometimes', 'date', 'after:now'],
            'meeting_link' => ['nullable', 'url', 'max:500'],
            'status' => ['sometimes', 'in:scheduled,in_progress,completed,cancelled'],
        ];
    }
}
