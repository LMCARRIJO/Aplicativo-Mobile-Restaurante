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
            'preco_promocional' => null,
            'foto_path' => null,
            'descricao' => fake()->sentence(12),
            'ingredientes' => fake()->sentence(8),
            'alergenicos' => $alergenicos ? implode(', ', $alergenicos) : null,
            'porcao' => fake()->numberBetween(1, 6),
            'disponivel' => fake()->boolean(80),
            'promocao_fim' => null,
            'categoria' => fake()->randomElement(Produto::CATEGORIAS),
        ];
    }

    /**
     * Produto em promoção: preço promocional 20% menor que o cheio.
     * Sem `$fim` a promoção fica sem data de término.
     */
    public function emPromocao(?string $fim = null): static
    {
        return $this->state(fn (array $attributes) => [
            'preco_promocional' => round(((float) $attributes['preco']) * 0.8, 2),
            'promocao_fim' => $fim,
        ]);
    }
}
