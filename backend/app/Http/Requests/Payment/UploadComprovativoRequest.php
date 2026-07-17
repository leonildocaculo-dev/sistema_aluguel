<?php

namespace App\Http\Requests\Payment;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UploadComprovativoRequest extends FormRequest
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
            // Rule::file instead of mimes directly forces Laravel 11 to do deep MIME checking
            'comprovativo' => ['required', \Illuminate\Validation\Rules\File::types(['jpeg', 'png', 'jpg', 'pdf'])->max(5 * 1024)],
        ];
    }
}
