<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Atributo 7: categoria (string, opcional - ex: Entrada, Prato Principal...).
     * Último atributo pendente: com este, os 7 atributos estão completos.
     */
    public function up(): void
    {
        Schema::table('produtos', function (Blueprint $table) {
            $table->string('categoria', 80)->nullable()->after('data_validade');
        });
    }

    public function down(): void
    {
        Schema::table('produtos', function (Blueprint $table) {
            $table->dropColumn('categoria');
        });
    }
};
