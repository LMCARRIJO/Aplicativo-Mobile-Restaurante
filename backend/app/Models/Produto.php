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
}
