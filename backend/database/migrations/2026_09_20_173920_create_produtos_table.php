<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Oi! Deixei aqui só 3 campos base (nome, preco, foto) pra você continuar tranquilo.
     * Quando for sua vez, cria uma migration nova e adiciona: descricao, quantidade_estoque, data_validade, categoria
     */
    public function up(): void
    {
        Schema::create('produtos', function (Blueprint $table) {
            $table->id();
            // --- aqui vão os 3 campos que já deixei prontos pra você ---
            $table->string('nome', 150); // string
            $table->decimal('preco', 10, 2); // number decimal
            $table->string('foto_path')->nullable(); // foto (caminho storage)

            // --- aqui é onde você continua - falta adicionar 4 campos em uma migration nova ---
            // Te deixo um exemplo de como você pode fazer:
            // $table->text('descricao')->nullable(); // string longa
            // $table->integer('quantidade_estoque')->default(0); // number integer
            // $table->date('data_validade')->nullable(); // date
            // $table->string('categoria', 80)->nullable(); // string

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produtos');
    }
};
