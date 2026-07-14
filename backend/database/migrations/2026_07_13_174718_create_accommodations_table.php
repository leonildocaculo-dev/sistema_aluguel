<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('accommodations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            $table->string('name'); // e.g., "Quarto Duplo Vista Mar"
            $table->text('description')->nullable();
            $table->integer('capacity'); // number of people
            $table->decimal('price_per_night', 10, 2);
            $table->integer('quantity')->default(1); // How many of this type exist
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accommodations');
    }
};
