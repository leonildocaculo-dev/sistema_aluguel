<?php

namespace App\Http\Requests\Kyc;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UploadKycRequest extends FormRequest
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
            'document_type' => 'required|string|in:bi,passaporte,carta_conducao',
            'document' => ['required', \Illuminate\Validation\Rules\File::types(['jpeg', 'png', 'jpg', 'pdf'])->max(5 * 1024)],
        ];
    }
}
