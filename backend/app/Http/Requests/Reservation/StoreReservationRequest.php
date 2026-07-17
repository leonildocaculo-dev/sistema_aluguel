<?php

namespace App\Http\Requests\Reservation;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
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
            'accommodation_id' => 'required|exists:accommodations,id',
            'booking_type' => 'required|in:daily,hourly',
            'check_in' => 'required|date|after_or_equal:today',
            // Para reservas por hora, check_out pode ser igual a check_in.
            'check_out' => 'required|date|after_or_equal:check_in',
            'payment_method' => 'required|string|in:proxypay,gpo_iframe,manual',
            'guests' => 'nullable|integer|min:1',
            'package' => 'nullable|string',
        ];
    }
}
