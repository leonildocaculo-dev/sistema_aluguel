<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_webhook_logs', function (Blueprint $table) {
            $table->id();
            $table->string('gateway'); // ex: proxypay
            $table->string('event_type')->nullable();
            $table->jsonb('payload'); // O corpo completo do webhook
            $table->string('ip_address')->nullable();
            $table->boolean('is_verified')->default(false); // Assinatura verificada?
            $table->boolean('is_processed')->default(false); // Processado com sucesso?
            $table->text('processing_error')->nullable();
            $table->timestamps(); // Created_at = data de recepção. Updates só devem ocorrer para marcar is_processed.
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_webhook_logs');
    }
};
