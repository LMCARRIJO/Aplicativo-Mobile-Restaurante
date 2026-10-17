<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('produtos', function (Blueprint $table) {
            $table->text('descricao')->nullable()->after('nome');
            $table->integer('quantidade_estoque')->default(0)->after('preco');
            $table->date('data_validade')->nullable()->after('quantidade_estoque');
            $table->string('categoria', 80)->nullable()->after('data_validade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produtos', function (Blueprint $table) {
            $table->dropColumn(['descricao', 'quantidade_estoque', 'data_validade', 'categoria']);
        });
    }
};
