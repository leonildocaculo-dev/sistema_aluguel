<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
        $passwordRules = [
            'required', 'string', 'min:8', 'confirmed',
            'regex:/[a-z]/', 'regex:/[A-Z]/', 'regex:/[0-9]/', 'regex:/[@$!%*#?&]/'
        ];

        if (config('features.password_breach_check', false)) {
            $passwordRules[] = \Illuminate\Validation\Rules\Password::defaults()->uncompromised(3); // Permite até 3 vazamentos na DB (tolerância leve)
        }

        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:20|unique:users,phone',
            'password' => $passwordRules,
            'role' => 'required|in:client,owner',
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'Este e-mail já existe no sistema.',
            'phone.unique' => 'Este telefone já existe no sistema.',
            'password.regex' => 'A palavra-passe deve conter letras maiúsculas, minúsculas, números e símbolos.',
            'password.uncompromised' => 'Esta palavra-passe apareceu numa fuga de dados na internet. Por favor, escolha outra mais segura.',
        ];
    }
}
