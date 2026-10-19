<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    use HasFactory;

    /**
     * Categorias fixas do cardápio.
     */
    public const CATEGORIAS = [
        'Entrada',
        'Prato Principal',
        'Sobremesa',
        'Bebida',
        'Acompanhamento',
    ];

    /**
     * Atributos preenchíveis em massa.
     */
    protected $fillable = [
        'nome',
        'preco',
        'preco_promocional',
        'foto_path',
        'descricao',
        'ingredientes',
        'alergenicos',
        'porcao',
        'disponivel',
        'promocao_fim',
        'categoria',
    ];

    protected $casts = [
        'preco' => 'decimal:2',
        'preco_promocional' => 'decimal:2',
        'porcao' => 'integer',
        'disponivel' => 'boolean',
        'promocao_fim' => 'date',
    ];

    protected $attributes = [
        'disponivel' => true,
    ];

    /**
     * Accessor para URL pública da foto
     */
    public function getFotoUrlAttribute(): ?string
    {
        return $this->foto_path ? asset('storage/'.$this->foto_path) : null;
    }

    /**
     * Preço que vale agora: o promocional enquanto a promoção não venceu,
     * senão o preço cheio. É esse valor que entra na comanda.
     */
    public function precoVigente(): string
    {
        $promocional = $this->preco_promocional;

        if ($promocional === null || (float) $promocional <= 0) {
            return (string) $this->preco;
        }

        if ($this->promocao_fim !== null && $this->promocao_fim->endOfDay()->isPast()) {
            return (string) $this->preco;
        }

        return (string) $promocional;
    }
}
