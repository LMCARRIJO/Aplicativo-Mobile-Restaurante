<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Atributo 6: data_validade (date, opcional).
     * Você pediu atributo por atributo, então esta migration adiciona só este campo.
     */
    public function up(): void
    {
        Schema::table('produtos', function (Blueprint $table) {
            $table->date('data_validade')->nullable()->after('quantidade_estoque');
        });
    }

    public function down(): void
    {
        Schema::table('produtos', function (Blueprint $table) {
            $table->dropColumn('data_validade');
        });
    }
};
