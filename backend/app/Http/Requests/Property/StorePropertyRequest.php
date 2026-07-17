<?php

namespace App\Http\Requests\Property;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePropertyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'address' => 'required|string',
            'city' => 'required|string',
            'province' => 'required|string',
            'municipality' => 'required|string',
            'type' => 'required|string|in:house,apartment,hotel,resort,guesthouse',
            'status' => 'required|in:active,inactive',
            'features' => 'nullable|array',
            'images' => 'nullable|array',
            'images.*' => ['nullable', \Illuminate\Validation\Rules\File::types(['jpeg', 'png', 'jpg'])->max(5 * 1024)],
        ];
    }
}
