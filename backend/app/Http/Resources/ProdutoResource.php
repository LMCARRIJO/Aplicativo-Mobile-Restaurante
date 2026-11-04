<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProdutoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'preco' => $this->preco,
            'preco_promocional' => $this->preco_promocional,
            'foto_path' => $this->foto_path,
            'foto_url' => $this->foto_url,
            'descricao' => $this->descricao,
            'ingredientes' => $this->ingredientes,
            'alergenicos' => $this->alergenicos,
            'porcao' => $this->porcao,
            'disponivel' => $this->disponivel,
            'promocao_fim' => $this->promocao_fim?->format('Y-m-d'),
            'categoria' => $this->categoria,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
