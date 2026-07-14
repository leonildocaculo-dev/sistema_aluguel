<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained()->cascadeOnDelete();
            $table->enum('metodo', ['referencia', 'multicaixa_iframe', 'transferencia']);
            $table->decimal('valor', 10, 2);
            $table->string('referencia_gerada')->nullable();
            $table->jsonb('webhook_payload')->nullable();
            $table->string('comprovativo_path')->nullable();
            $table->enum('estado', ['pendente', 'aguarda_validação', 'confirmado', 'rejeitado', 'expirado'])->default('pendente');
            $table->string('idempotency_key')->unique();
            $table->foreignId('validado_por')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('data_pagamento')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
