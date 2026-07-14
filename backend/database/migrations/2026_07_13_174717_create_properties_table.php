<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // owner
            $table->string('name');
            $table->text('description');
            $table->string('province');
            $table->string('municipality');
            $table->string('address');
            $table->decimal('price_per_night', 10, 2)->default(0); // Base price for indexing
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
            
            // Requisito obrigatório do SKILL.md
            $table->index(['province', 'municipality', 'price_per_night']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
