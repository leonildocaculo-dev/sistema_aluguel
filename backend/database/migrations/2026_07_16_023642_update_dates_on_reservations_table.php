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
        Schema::table('reservations', function (Blueprint $table) {
            $table->enum('booking_type', ['daily', 'hourly'])->default('daily')->after('accommodation_id');
            // Change date to datetime
            $table->dateTime('check_in')->change();
            $table->dateTime('check_out')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn('booking_type');
            $table->date('check_in')->change();
            $table->date('check_out')->change();
        });
    }
};
