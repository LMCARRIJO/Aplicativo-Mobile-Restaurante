<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    use HasFactory;

    /**
     * Atributos preenchíveis em massa.
     */
    protected $fillable = [
        'nome',
        'preco',
        'foto_path',
        'descricao',
        'quantidade_estoque',
        'data_validade',
        'categoria',
    ];

    protected $casts = [
        'preco' => 'decimal:2',
        'quantidade_estoque' => 'integer',
        'data_validade' => 'date',
    ];

    protected $attributes = [
        'quantidade_estoque' => 0,
    ];

    /**
     * Accessor para URL pública da foto
     */
    public function getFotoUrlAttribute(): ?string
    {
        return $this->foto_path ? asset('storage/'.$this->foto_path) : null;
    }
}
