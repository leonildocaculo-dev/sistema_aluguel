<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Necessário para a constraint de exclusão usando gist com tipos escalares como int/date
        DB::statement('CREATE EXTENSION IF NOT EXISTS btree_gist');

        Schema::create('availabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('accommodation_id')->constrained()->cascadeOnDelete();
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_blocked')->default(false); // True = blocked by owner, False = reserved by client
            $table->unsignedBigInteger('reservation_id')->nullable();
            
            $table->timestamps();
        });

        // Adicionar a constraint de exclusão com SQL Raw
        // Impede que para o mesmo accommodation_id haja sobreposição no intervalo de datas [start_date, end_date)
        DB::statement("
            ALTER TABLE availabilities 
            ADD CONSTRAINT prevent_double_booking 
            EXCLUDE USING gist (
                accommodation_id WITH =,
                daterange(start_date, end_date, '[)') WITH &&
            )
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('availabilities');
        DB::statement('DROP EXTENSION IF EXISTS btree_gist');
    }
};
