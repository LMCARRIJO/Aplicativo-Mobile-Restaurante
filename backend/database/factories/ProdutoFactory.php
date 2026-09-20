<?php

namespace Database\Factories;

use App\Models\Produto;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Produto>
 */
class ProdutoFactory extends Factory
{
    protected $model = Produto::class;

    public function definition(): array
    {
        return [
            'nome' => fake()->words(3, true),
            'descricao' => fake()->sentence(12),
            'preco' => fake()->randomFloat(2, 5, 200),
            'quantidade_estoque' => fake()->numberBetween(0, 100),
            'data_validade' => fake()->dateTimeBetween('+1 week', '+2 months')->format('Y-m-d'),
            'categoria' => fake()->randomElement(['Entrada', 'Prato Principal', 'Sobremesa', 'Bebida']),
            'foto_path' => null,
        ];
    }
}
