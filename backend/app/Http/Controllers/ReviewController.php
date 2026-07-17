<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Reservation;
use App\Models\Accommodation;
use App\Models\Accommodation;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Http\Requests\Review\StoreReviewRequest;

class ReviewController extends Controller
{
    // Cliente: Submeter avaliação
    public function store(StoreReviewRequest $request)
    {
        $reservation = Reservation::where('user_id', $request->user()->id)->findOrFail($request->reservation_id);

        // Só pode avaliar se a reserva estiver confirmada e o check_out já tiver passado
        if ($reservation->status !== 'confirmado') {
            return response()->json(['message' => 'Só pode avaliar reservas confirmadas.'], 400);
        }

        if (Carbon::parse($reservation->check_out)->isFuture()) {
            return response()->json(['message' => 'Só pode avaliar a estadia após a data de check-out.'], 400);
        }

        if ($reservation->review) {
            return response()->json(['message' => 'Já submeteu uma avaliação para esta reserva.'], 400);
        }

        $review = Review::create([
            'reservation_id' => $reservation->id,
            'user_id' => $request->user()->id,
            'accommodation_id' => $reservation->accommodation_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json(['message' => 'Avaliação submetida com sucesso.', 'review' => $review], 201);
    }

    // Público: Listar avaliações de um alojamento
    public function index($accommodationId)
    {
        $accommodation = Accommodation::findOrFail($accommodationId);
        $reviews = $accommodation->reviews()->with('user:id,name')->orderBy('created_at', 'desc')->paginate(10);
        
        return response()->json([
            'average_rating' => $accommodation->average_rating,
            'total_reviews' => $accommodation->reviews()->count(),
            'reviews' => $reviews
        ]);
    }
}
