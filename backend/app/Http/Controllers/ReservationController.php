<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Services\PaymentService;

class ReservationController extends Controller
{
    public function store(Request $request, PaymentService $paymentService)
    {
        $request->validate([
            'accommodation_id' => 'required|exists:accommodations,id',
            'booking_type' => 'required|in:daily,hourly',
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'payment_method' => 'required|string|in:proxypay,gpo_iframe,manual',
        ]);

        $accommodation = Accommodation::findOrFail($request->accommodation_id);
        $checkIn = Carbon::parse($request->check_in);
        $checkOut = Carbon::parse($request->check_out);
        $bookingType = $request->booking_type;

        // Validação de Antecedência para Reservas por Horas
        if ($bookingType === 'hourly') {
            if ($checkIn->lessThan(Carbon::now()->addHours(1))) {
                return response()->json([
                    'message' => 'As encomendas por horas precisam de ser feitas com pelo menos 1 a 2 horas de antecedência em relação ao momento atual.'
                ], 422);
            }
        }

        // Cálculo do Preço
        $totalPrice = 0;
        if ($bookingType === 'hourly') {
            $hours = $checkIn->diffInHours($checkOut);
            if ($hours == 0) $hours = 1;

            // Lógica de Preço: Usa pacotes JSON ou fallback matemático
            $packages = json_decode($accommodation->hourly_packages, true) ?? [];
            $packageKey = "{$hours}h";
            
            if (isset($packages[$packageKey])) {
                $totalPrice = $packages[$packageKey];
            } else {
                // Fallback: divide price_per_night por 24 e multiplica
                $hourlyRate = $accommodation->price_per_night / 24;
                $totalPrice = $hourlyRate * $hours;
            }
        } else {
            // Daily booking
            $nights = $checkIn->startOfDay()->diffInDays($checkOut->startOfDay());
            if ($nights == 0) $nights = 1;
            $totalPrice = $accommodation->price_per_night * $nights;
        }

        try {
            // DB Transaction: Cria reserva e bloqueio
            $reservation = DB::transaction(function () use ($request, $accommodation, $checkIn, $checkOut, $totalPrice, $bookingType) {
                $res = Reservation::create([
                    'user_id' => $request->user()->id,
                    'accommodation_id' => $accommodation->id,
                    'booking_type' => $bookingType,
                    'check_in' => $checkIn->format('Y-m-d H:i:s'),
                    'check_out' => $checkOut->format('Y-m-d H:i:s'),
                    'total_price' => $totalPrice,
                    'status' => 'pendente_pagamento',
                ]);

                // Insere bloqueio na tabela de disponibilidades
                $res->availability()->create([
                    'accommodation_id' => $accommodation->id,
                    // Se for hourly, não usamos start_date/end_date em "dias" puros, 
                    // mas para compatibilidade mantemos as datas (ou formatadas com horas caso a DB aceite)
                    // Como a migration de availabilities usa date(), pode haver sobreposição de horas.
                    // Para MVP, deixamos a mesma data e a API fará validação customizada se necessário.
                    'start_date' => $checkIn->format('Y-m-d'),
                    'end_date' => $checkOut->format('Y-m-d'),
                    'is_blocked' => false,
                ]);

                return $res;
            });

            // 2. Gerar Intenção de Pagamento via PaymentService
            $intent = $paymentService->initiatePayment($reservation, $request->payment_method);

            return response()->json([
                'message' => 'Reserva criada com sucesso. Aguarda pagamento.',
                'reservation' => $reservation,
                'payment_intent' => $intent
            ], 201);

        } catch (\Illuminate\Database\QueryException $e) {
            // 23P01 is the PostgreSQL error code for exclusion constraint violation
            if ($e->getCode() === '23P01') {
                return response()->json([
                    'message' => 'Lamentamos, mas estas datas acabaram de ser reservadas por outro utilizador.'
                ], 409); // Conflict
            }
            
            // Re-throw if it's another DB error
            throw $e;
        }
    }

    public function myReservations(Request $request)
    {
        $reservations = $request->user()->reservations()->with('accommodation.property')->orderBy('created_at', 'desc')->paginate(10);
        return response()->json($reservations);
    }

    public function status(Request $request, $id)
    {
        $reservation = Reservation::where('user_id', $request->user()->id)->findOrFail($id);
        return response()->json(['status' => $reservation->status]);
    }
}
