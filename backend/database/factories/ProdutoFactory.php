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
        $alergenicos = fake()->optional(0.7)->randomElements(
            ['Glúten', 'Lactose', 'Ovos', 'Amendoim', 'Frutos do mar', 'Soja'],
            fake()->numberBetween(1, 2),
        );

        return [
            'nome' => fake()->words(3, true),
            'preco' => fake()->randomFloat(2, 5, 200),
            'preco_promocional' => fake()->optional(0.3)->randomFloat(2, 3, 150),
            'foto_path' => null,
            'descricao' => fake()->sentence(12),
            'ingredientes' => fake()->sentence(8),
            'alergenicos' => $alergenicos ? implode(', ', $alergenicos) : null,
            'porcao' => fake()->numberBetween(1, 6),
            'disponivel' => fake()->boolean(80),
            'promocao_fim' => fake()->optional(0.3)->dateTimeBetween('now', '+1 month')?->format('Y-m-d'),
            'categoria' => fake()->randomElement(Produto::CATEGORIAS),
        ];
    }
}
