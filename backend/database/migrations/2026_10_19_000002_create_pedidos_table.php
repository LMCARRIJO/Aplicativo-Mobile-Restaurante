<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Comandas: um pedido por vez por mesa (enquanto estiver ativo).
     */
    public function up(): void
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mesa_id')->constrained('mesas')->cascadeOnDelete();
            $table->enum('status', ['aberto', 'em_preparo', 'pronto', 'entregue', 'cancelado'])->default('aberto');
            $table->text('observacao')->nullable();
            $table->decimal('total', 10, 2)->default(0);
            $table->timestamps();

            $table->index(['mesa_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};
