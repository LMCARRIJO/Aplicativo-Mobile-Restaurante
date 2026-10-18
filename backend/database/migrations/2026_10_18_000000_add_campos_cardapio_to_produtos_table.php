<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('produtos', function (Blueprint $table) {
            $table->decimal('preco_promocional', 8, 2)->nullable()->after('preco');
            $table->text('ingredientes')->nullable()->after('descricao');
            $table->string('alergenicos', 255)->nullable()->after('ingredientes');
            $table->integer('porcao')->nullable()->after('alergenicos');
            $table->boolean('disponivel')->default(true)->after('porcao');
            $table->date('promocao_fim')->nullable()->after('disponivel');
        });

        Schema::table('produtos', function (Blueprint $table) {
            $table->dropColumn(['quantidade_estoque', 'data_validade']);
        });
    }

    public function down(): void
    {
        Schema::table('produtos', function (Blueprint $table) {
            $table->integer('quantidade_estoque')->default(0)->after('preco');
            $table->date('data_validade')->nullable()->after('quantidade_estoque');
        });

        Schema::table('produtos', function (Blueprint $table) {
            $table->dropColumn([
                'preco_promocional',
                'ingredientes',
                'alergenicos',
                'porcao',
                'disponivel',
                'promocao_fim',
            ]);
        });
    }
};
