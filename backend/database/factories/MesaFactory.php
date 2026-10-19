<?php

namespace Database\Factories;

use App\Models\Mesa;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Mesa>
 */
class MesaFactory extends Factory
{
    protected $model = Mesa::class;

    public function definition(): array
    {
        return [
            'numero' => fake()->unique()->numberBetween(1, 999),
            'capacidade' => fake()->randomElement([2, 4, 6, 8]),
            'ativa' => true,
        ];
    }
}
