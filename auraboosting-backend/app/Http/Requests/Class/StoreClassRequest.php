<?php

namespace App\Http\Requests\Class;

use Illuminate\Foundation\Http\FormRequest;

class StoreClassRequest extends FormRequest
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
            'game_id' => ['required', 'exists:games,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'duration' => ['required', 'integer', 'min:15', 'max:480'],
            'price' => ['required', 'numeric', 'min:0', 'max:999999.99'],
            'max_students' => ['required', 'integer', 'min:1', 'max:50'],
            'scheduled_at' => ['required', 'date', 'after:now'],
            'meeting_link' => ['nullable', 'url', 'max:500'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'game_id.required' => 'El juego es requerido',
            'game_id.exists' => 'El juego seleccionado no existe',
            'scheduled_at.after' => 'La fecha debe ser futura',
        ];
    }
}
