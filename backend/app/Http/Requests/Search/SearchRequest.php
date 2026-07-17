<?php

namespace App\Http\Requests\Search;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SearchRequest extends FormRequest
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
            'province' => 'nullable|string',
            'municipality' => 'nullable|string',
            'capacity' => 'nullable|integer|min:1',
            'check_in' => 'nullable|date|after_or_equal:today',
            'check_out' => 'nullable|date|after:check_in',
            'query' => 'nullable|string|max:100',
            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0',
            'types' => 'nullable|array',
            'types.*' => 'nullable|string',
            'amenities' => 'nullable|array',
            'amenities.*' => 'nullable|string',
            'sort' => 'nullable|string|in:recommended,price_asc,price_desc',
            'per_page' => 'nullable|integer|min:1|max:50',
        ];
    }
}
