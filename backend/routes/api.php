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
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\KycVerificationController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\OwnerMiddleware;

Route::middleware(['throttle:webhooks', 'ip.whitelist'])->group(function () {
    Route::post('/webhooks/payment/{gateway}', [WebhookController::class, 'handle'])->name('webhooks.payment');
});

Route::post('/webhooks/mock', [WebhookController::class, 'mock'])->middleware('throttle:webhooks');

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
    Route::post('/kyc/upload', [KycVerificationController::class, 'uploadDocument'])->middleware('throttle:uploads');
    Route::get('/kyc/status', [KycVerificationController::class, 'checkStatus']);

    // Cliente
    Route::post('/reviews', [\App\Http\Controllers\ReviewController::class, 'store']);
    Route::get('/reservations/me', [ReservationController::class, 'myReservations']);
    Route::get('/reservations/{id}', [ReservationController::class, 'show']);
    Route::get('/reservations/{id}/status', [ReservationController::class, 'status']);
    Route::post('/reservations', [ReservationController::class, 'store'])
         ->middleware('throttle:uploads');
    Route::post('/reservations/{id}/comprovativo', [PaymentController::class, 'uploadComprovativo'])
         ->middleware('throttle:uploads'); // Limit uploads to 10 per minute per user to prevent storage exhaustion

    // Favoritos
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::get('/favorites/ids', [FavoriteController::class, 'listIds']);
    Route::post('/favorites/{id}/toggle', [FavoriteController::class, 'toggle']);

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
        
        // Users CRUD
        Route::get('/admin/users', [\App\Http\Controllers\Api\Admin\AdminUserController::class, 'index']);
        Route::put('/admin/users/{id}', [\App\Http\Controllers\Api\Admin\AdminUserController::class, 'update']);
        Route::post('/admin/users/{id}/toggle-status', [\App\Http\Controllers\Api\Admin\AdminUserController::class, 'toggleStatus']);

        // Settings & System
        Route::get('/admin/settings', [\App\Http\Controllers\Api\Admin\AdminSettingsController::class, 'index']);
        Route::put('/admin/settings', [\App\Http\Controllers\Api\Admin\AdminSettingsController::class, 'update']);
        Route::get('/admin/system/features', [\App\Http\Controllers\Api\Admin\FeatureFlagController::class, 'index']);
    });
});
