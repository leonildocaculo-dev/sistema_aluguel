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
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'payment_method' => 'required|string|in:proxypay,gpo_iframe,manual',
        ]);

        $accommodation = Accommodation::findOrFail($request->accommodation_id);
        $checkIn = Carbon::parse($request->check_in);
        $checkOut = Carbon::parse($request->check_out);
        $nights = $checkIn->diffInDays($checkOut);
        $totalPrice = $accommodation->price_per_night * $nights;

        try {
            // DB Transaction: Cria reserva e tenta criar disponibilidade (bloqueio).
            // A genialidade da nossa arquitetura: Se outra thread já tiver reservado estas datas,
            // o PostgreSQL lança uma QueryException na tabela availabilities devido à constraint EXCLUDE USING gist.
            // Isso previne 100% de duplo-booking.
            
            $reservation = DB::transaction(function () use ($request, $accommodation, $checkIn, $checkOut, $totalPrice) {
                $res = Reservation::create([
                    'user_id' => $request->user()->id,
                    'accommodation_id' => $accommodation->id,
                    'check_in' => $checkIn->format('Y-m-d'),
                    'check_out' => $checkOut->format('Y-m-d'),
                    'total_price' => $totalPrice,
                    'status' => 'pendente_pagamento', // Regra: toda reserva inicia pendente
                ]);

                // Insere bloqueio na tabela de disponibilidades
                $res->availability()->create([
                    'accommodation_id' => $accommodation->id,
                    'start_date' => $checkIn->format('Y-m-d'),
                    'end_date' => $checkOut->format('Y-m-d'),
                    'is_blocked' => false, // false porque foi reservado por um cliente, não bloqueio do dono
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
