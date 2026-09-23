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
            'descricao' => $this->descricao,
            'preco' => $this->preco,
            'quantidade_estoque' => $this->quantidade_estoque,
            'data_validade' => $this->data_validade?->format('Y-m-d'),
            'categoria' => $this->categoria,
            'foto_path' => $this->foto_path,
            'foto_url' => $this->foto_url, // accessor do Model
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
