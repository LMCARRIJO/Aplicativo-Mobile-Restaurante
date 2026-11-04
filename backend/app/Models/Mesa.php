<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Mesa extends Model
{
    use HasFactory;

    /**
     * Status calculado da mesa (não é coluna).
     */
    public const STATUS_LIVRE = 'livre';

    public const STATUS_OCUPADA = 'ocupada';

    protected $fillable = [
        'numero',
        'capacidade',
        'ativa',
    ];

    protected $casts = [
        'numero' => 'integer',
        'capacidade' => 'integer',
        'ativa' => 'boolean',
    ];

    /**
     * Espelha o default da migration para o objeto recém-criado já vir ativa.
     */
    protected $attributes = [
        'ativa' => true,
    ];

    public function pedidos(): HasMany
    {
        return $this->hasMany(Pedido::class);
    }

    /**
     * Comanda que ainda ocupa a mesa (aberta, na cozinha, pronta ou entregue).
     */
    public function pedidoAtivo(): HasOne
    {
        return $this->hasOne(Pedido::class)
            ->whereIn('status', Pedido::STATUS_ATIVOS)
            ->latest('id');
    }

    public function estaOcupada(): bool
    {
        return $this->pedidoAtivo()->exists();
    }
}
