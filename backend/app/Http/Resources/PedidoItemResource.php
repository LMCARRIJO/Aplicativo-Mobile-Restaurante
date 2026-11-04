<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PedidoItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'pedido_id' => $this->pedido_id,
            'produto_id' => $this->produto_id,
            'produto_nome' => $this->produto_nome,
            'quantidade' => (int) $this->quantidade,
            'preco_unitario' => $this->preco_unitario,
            'subtotal' => number_format($this->subtotal(), 2, '.', ''),
            'observacao' => $this->observacao,
            'status' => $this->status,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
