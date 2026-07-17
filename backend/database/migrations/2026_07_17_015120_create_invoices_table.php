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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // Cliente a quem foi faturado
            
            $table->string('invoice_number')->unique(); // Sequencial ex: FR 2026/1
            $table->enum('type', ['fatura', 'fatura_recibo', 'recibo', 'nota_credito'])->default('fatura_recibo');
            $table->enum('status', ['draft', 'issued', 'canceled'])->default('draft');
            
            // Valores Financeiros
            $table->decimal('base_amount', 12, 2);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('total_amount', 12, 2);
            
            // Dados Fiscais e Cliente congelados no momento
            $table->string('customer_name');
            $table->string('customer_nif')->nullable(); // NIF é opcional para consumidores finais
            $table->text('customer_address')->nullable();
            
            // Requisitos AGT (Hash RSA)
            $table->string('hash', 255)->nullable();
            
            $table->timestamp('issued_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
