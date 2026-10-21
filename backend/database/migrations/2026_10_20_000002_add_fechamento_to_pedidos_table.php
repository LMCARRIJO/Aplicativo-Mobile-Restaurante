<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pedidos', function (Blueprint $table) {
            $table->string('status', 20)->default('aberto')->change();
            $table->timestamp('fechado_em')->nullable()->after('pronto_em');
        });

        DB::table('pedidos')
            ->where('status', 'entregue')
            ->update([
                'status' => 'fechado',
                'fechado_em' => DB::raw('updated_at'),
            ]);
    }

    public function down(): void
    {
        DB::table('pedidos')->where('status', 'fechado')->update(['status' => 'entregue']);

        Schema::table('pedidos', function (Blueprint $table) {
            $table->dropColumn('fechado_em');
        });
    }
};
