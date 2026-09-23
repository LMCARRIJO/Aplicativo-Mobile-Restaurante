<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Atributo 5: quantidade_estoque (number integer, default 0).
     * Você pediu atributo por atributo, então esta migration adiciona só este campo.
     */
    public function up(): void
    {
        Schema::table('produtos', function (Blueprint $table) {
            $table->integer('quantidade_estoque')->default(0)->after('preco');
        });
    }

    public function down(): void
    {
        Schema::table('produtos', function (Blueprint $table) {
            $table->dropColumn('quantidade_estoque');
        });
    }
};
