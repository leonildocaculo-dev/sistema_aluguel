<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('accommodations', function (Blueprint $table) {
            $table->enum('rental_type', ['daily', 'hourly', 'both'])->default('daily')->after('price_per_night');
            // Stores JSON like: {"2h": 10000, "5h": 20000, "10h": 35000, "12h": 40000, "24h": 60000}
            $table->json('hourly_packages')->nullable()->after('rental_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('accommodations', function (Blueprint $table) {
            $table->dropColumn(['rental_type', 'hourly_packages']);
        });
    }
};
