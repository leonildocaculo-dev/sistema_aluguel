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
use App\Http\Controllers\KycVerificationController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\OwnerMiddleware;

Route::post('/webhooks/payment/{gateway}', [WebhookController::class, 'handle'])->name('webhooks.payment');

Route::middleware('throttle:auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Rotas Públicas
Route::get('/search', [SearchController::class, 'search']);
Route::get('/search/geo', [SearchController::class, 'geoSearch']);
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{id}', [PropertyController::class, 'show']);
Route::get('/accommodations/{id}/reviews', [\App\Http\Controllers\ReviewController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Privacidade e Perfil
    Route::put('/profile', [\App\Http\Controllers\Api\PrivacyController::class, 'updateProfile']);
    Route::post('/profile/deactivate', [\App\Http\Controllers\Api\PrivacyController::class, 'deactivateAccount']);
    
    // Rotas de KYC do Proprietário
    Route::post('/kyc/upload', [KycVerificationController::class, 'uploadDocument']);
    Route::get('/kyc/status', [KycVerificationController::class, 'checkStatus']);

    // Cliente
    Route::post('/reviews', [\App\Http\Controllers\ReviewController::class, 'store']);
    Route::get('/reservations/me', [ReservationController::class, 'myReservations']);
    Route::get('/reservations/{id}/status', [ReservationController::class, 'status']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::post('/reservations/{id}/comprovativo', [PaymentController::class, 'uploadComprovativo'])
         ->middleware('throttle:10,1'); // Limit uploads to 10 per minute per user to prevent storage exhaustion

    // Proprietário
    Route::middleware(OwnerMiddleware::class)->group(function () {
        Route::get('/my-properties', [PropertyController::class, 'myProperties']);
        Route::post('/properties', [PropertyController::class, 'store']);
    });

    // Admin
    Route::middleware(AdminMiddleware::class)->group(function () {
        Route::get('/admin/properties', [AdminPropertyController::class, 'index']);
        Route::post('/admin/properties/{id}/approve', [AdminPropertyController::class, 'approve']);
        Route::post('/admin/properties/{id}/reject', [AdminPropertyController::class, 'reject']);
        
        Route::get('/admin/payments/pending', [PaymentController::class, 'pendingApprovals']);
        Route::post('/admin/payments/{id}/approve', [PaymentController::class, 'approve']);
        Route::post('/admin/payments/{id}/reject', [PaymentController::class, 'reject']);

        Route::get('/admin/kyc/pending', [KycVerificationController::class, 'pendingKyc']);
        Route::post('/admin/kyc/{id}/approve', [KycVerificationController::class, 'approveKyc']);
        Route::post('/admin/kyc/{id}/reject', [KycVerificationController::class, 'rejectKyc']);
        
        Route::get('/admin/logs', [\App\Http\Controllers\Api\AuditLogController::class, 'index']);
    });
});
