<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\PropertyController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Api\AdminPropertyController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\Api\SearchController;

Route::post('/webhooks/payment/{gateway}', [WebhookController::class, 'handle'])->name('webhooks.payment');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rotas Públicas
Route::get('/search', [SearchController::class, 'search']);
Route::get('/search/geo', [SearchController::class, 'geoSearch']);
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{id}', [PropertyController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Cliente
    Route::get('/reservations/me', [ReservationController::class, 'myReservations']);
    Route::get('/reservations/{id}/status', [ReservationController::class, 'status']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::post('/reservations/{id}/comprovativo', [PaymentController::class, 'uploadComprovativo']);

    // Proprietário
    Route::get('/my-properties', [PropertyController::class, 'myProperties']);
    Route::post('/properties', [PropertyController::class, 'store']);

    // Admin
    Route::get('/admin/properties', [AdminPropertyController::class, 'index']);
    Route::post('/admin/properties/{id}/approve', [AdminPropertyController::class, 'approve']);
    Route::post('/admin/properties/{id}/reject', [AdminPropertyController::class, 'reject']);
    
    Route::get('/admin/payments/pending', [PaymentController::class, 'pendingApprovals']);
    Route::post('/admin/payments/{id}/approve', [PaymentController::class, 'approve']);
    Route::post('/admin/payments/{id}/reject', [PaymentController::class, 'reject']);
});
