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
            'preco' => fake()->randomFloat(2, 5, 200),
            'foto_path' => null,
            // Quando você criar os campos novos, descomenta aqui pra gerar dados falsos também
            // 'descricao' => fake()->sentence(12),
            // 'quantidade_estoque' => fake()->numberBetween(0, 100),
            // 'data_validade' => fake()->dateTimeBetween('+1 week', '+2 months')->format('Y-m-d'),
            // 'categoria' => fake()->randomElement(['Entrada','Prato Principal','Sobremesa','Bebida']),
        ];
    }
}
