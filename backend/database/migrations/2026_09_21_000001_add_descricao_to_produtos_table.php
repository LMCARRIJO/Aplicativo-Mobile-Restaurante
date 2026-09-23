<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Atributo 4: descricao (string longa, opcional).
     * Você pediu atributo por atributo, então esta migration adiciona só este campo.
     */
    public function up(): void
    {
        Schema::table('produtos', function (Blueprint $table) {
            $table->text('descricao')->nullable()->after('nome');
        });
    }

    public function down(): void
    {
        Schema::table('produtos', function (Blueprint $table) {
            $table->dropColumn('descricao');
        });
    }
};
