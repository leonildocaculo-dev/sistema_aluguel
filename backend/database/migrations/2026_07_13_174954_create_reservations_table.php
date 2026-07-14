<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // Cliente
            $table->foreignId('accommodation_id')->constrained()->cascadeOnDelete();
            $table->date('check_in');
            $table->date('check_out');
            $table->decimal('total_price', 10, 2);
            $table->enum('status', ['pendente_pagamento', 'aguarda_validação', 'confirmado', 'rejeitado', 'expirado', 'finalizada'])->default('pendente_pagamento');
            $table->timestamps();
        });

        // Adicionar a foreign key que faltava na tabela availabilities
        Schema::table('availabilities', function (Blueprint $table) {
            $table->foreign('reservation_id')->references('id')->on('reservations')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('availabilities', function (Blueprint $table) {
            $table->dropForeign(['reservation_id']);
        });
        Schema::dropIfExists('reservations');
    }
};
