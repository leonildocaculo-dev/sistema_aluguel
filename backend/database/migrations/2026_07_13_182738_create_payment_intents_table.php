<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_intents', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('reservation_id')->constrained()->cascadeOnDelete();
            $table->string('gateway'); // proxypay, gpo, manual
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('AOA');
            $table->string('gateway_reference')->nullable(); // Ex: A referência Multicaixa gerada
            $table->jsonb('gateway_response')->nullable(); // Dados extra do gateway
            $table->enum('status', ['pending', 'processing', 'succeeded', 'failed', 'canceled'])->default('pending');
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            // Índices para performance na pesquisa de webhooks
            $table->index('gateway_reference');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_intents');
    }
};
