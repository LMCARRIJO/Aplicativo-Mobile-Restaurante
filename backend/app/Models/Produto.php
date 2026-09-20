<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    use HasFactory;

    /**
     * Atributos que você pode preencher de uma vez.
     * Já deixei 3 liberados; os outros 4 você libera quando criar sua migration - é só descomentar
     */
    protected $fillable = [
        'nome',
        'descricao',
        'preco',
        'quantidade_estoque',
        'data_validade',
        'categoria',
        'foto_path',
    ];

    protected $casts = [
        'preco' => 'decimal:2',
        'quantidade_estoque' => 'integer',
        'data_validade' => 'date',
    ];

    /**
     * Accessor para URL pública da foto
     */
    public function getFotoUrlAttribute(): ?string
    {
        return $this->foto_path ? asset('storage/' . $this->foto_path) : null;
    }
}
