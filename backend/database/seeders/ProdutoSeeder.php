<?php

namespace Database\Seeders;

use App\Models\Produto;
use Illuminate\Database\Seeder;

class ProdutoSeeder extends Seeder
{
    public function run(): void
    {
        Produto::factory()->count(7)->create();

        // Alguns itens com promoção vigente para o cardápio de exemplo.
        Produto::factory()
            ->count(3)
            ->emPromocao(now()->addMonth()->format('Y-m-d'))
            ->create();
    }
}
