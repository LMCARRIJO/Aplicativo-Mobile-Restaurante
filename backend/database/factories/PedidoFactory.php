<?php

namespace Database\Factories;

use App\Models\Mesa;
use App\Models\Pedido;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pedido>
 */
class PedidoFactory extends Factory
{
    protected $model = Pedido::class;

    public function definition(): array
    {
        return [
            'mesa_id' => Mesa::factory(),
            'status' => Pedido::STATUS_ABERTO,
            'observacao' => null,
            'total' => 0,
        ];
    }

    public function emPreparo(): static
    {
        return $this->state(['status' => Pedido::STATUS_EM_PREPARO]);
    }

    public function pronto(): static
    {
        return $this->state(['status' => Pedido::STATUS_PRONTO]);
    }
}
