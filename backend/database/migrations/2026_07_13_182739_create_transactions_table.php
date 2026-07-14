<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('reservation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payment_id')->constrained()->cascadeOnDelete(); // FK para a tabela de payments oficial
            $table->decimal('total_amount', 10, 2);
            $table->decimal('platform_fee', 10, 2); // O valor da comissão retida
            $table->decimal('owner_amount', 10, 2); // O valor a liquidar ao proprietário
            $table->decimal('commission_rate', 5, 2); // Percentagem no momento da geração (ex: 15.00)
            $table->enum('status', ['pending_settlement', 'settled', 'refunded'])->default('pending_settlement');
            $table->timestamp('settled_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
