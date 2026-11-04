<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pedido_itens', function (Blueprint $table) {
            $table->string('status', 20)->default('pendente')->after('observacao');
            $table->index(['pedido_id', 'status']);
        });

        $mapa = [
            'aberto' => 'pendente',
            'em_preparo' => 'em_preparo',
            'pronto' => 'pronto',
            'entregue' => 'entregue',
            'cancelado' => 'cancelado',
        ];

        DB::table('pedido_itens')->orderBy('id')->chunkById(500, function ($itens) use ($mapa) {
            foreach ($itens as $item) {
                $statusPedido = DB::table('pedidos')->where('id', $item->pedido_id)->value('status');

                DB::table('pedido_itens')->where('id', $item->id)->update([
                    'status' => $mapa[$statusPedido] ?? 'pendente',
                ]);
            }
        });
    }

    public function down(): void
    {
        Schema::table('pedido_itens', function (Blueprint $table) {
            $table->dropIndex(['pedido_id', 'status']);
            $table->dropColumn('status');
        });
    }
};
