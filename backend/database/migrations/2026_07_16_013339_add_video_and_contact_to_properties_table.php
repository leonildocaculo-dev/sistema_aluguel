<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Video constraints:
     * - Max duration: 30 seconds
     * - Max file size: 30MB
     * - Allowed extensions: mp4, webm, mov, avi, mkv
     */
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            // Video fields
            $table->string('video_path')->nullable()->after('status');
            $table->string('video_mime_type')->nullable()->after('video_path');
            $table->unsignedInteger('video_size_bytes')->nullable()->after('video_mime_type');
            $table->unsignedSmallInteger('video_duration_seconds')->nullable()->after('video_size_bytes');

            // Contact fields
            $table->string('contact_phone', 20)->nullable()->after('address');
            $table->string('contact_email')->nullable()->after('contact_phone');
            $table->string('contact_website')->nullable()->after('contact_email');

            // GPS coordinates (enhanced precision)
            $table->decimal('latitude', 10, 7)->nullable()->change();
            $table->decimal('longitude', 10, 7)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn([
                'video_path',
                'video_mime_type',
                'video_size_bytes',
                'video_duration_seconds',
                'contact_phone',
                'contact_email',
                'contact_website',
            ]);
        });
    }
};
