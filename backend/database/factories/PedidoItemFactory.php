<?php

namespace Database\Factories;

use App\Models\Pedido;
use App\Models\PedidoItem;
use App\Models\Produto;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PedidoItem>
 */
class PedidoItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'pedido_id' => Pedido::factory(),
            'produto_id' => Produto::factory(),
            'produto_nome' => fake()->words(2, true),
            'quantidade' => fake()->numberBetween(1, 3),
            'preco_unitario' => fake()->randomFloat(2, 5, 100),
            'observacao' => null,
            'status' => 'pendente',
        ];
    }
}
