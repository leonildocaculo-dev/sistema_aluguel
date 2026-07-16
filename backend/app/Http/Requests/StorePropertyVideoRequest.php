<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePropertyVideoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'video' => [
                'required',
                'file',
                'mimes:mp4,webm,mov,avi,mkv',
                'max:30720', // 30MB in KB
            ],
            'duration_seconds' => [
                'required',
                'integer',
                'min:1',
                'max:30', // Max 30 seconds
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'video.required' => 'O vídeo é obrigatório.',
            'video.mimes' => 'Formato inválido. Formatos aceites: MP4, WebM, MOV, AVI, MKV.',
            'video.max' => 'O vídeo não pode exceder 30MB.',
            'duration_seconds.max' => 'O vídeo não pode ter mais de 30 segundos.',
        ];
    }
}
