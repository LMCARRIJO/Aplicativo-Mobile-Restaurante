<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tempos da cozinha: quando a comanda entrou na fila e quando ficou pronta.
     * O painel da cozinha usa `enviado_em` para mostrar o tempo de espera.
     */
    public function up(): void
    {
        Schema::table('pedidos', function (Blueprint $table) {
            $table->timestamp('enviado_em')->nullable();
            $table->timestamp('pronto_em')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('pedidos', function (Blueprint $table) {
            $table->dropColumn(['enviado_em', 'pronto_em']);
        });
    }
};
