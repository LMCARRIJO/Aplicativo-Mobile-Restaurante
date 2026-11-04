<?php

namespace App\Http\Resources;

use App\Models\Mesa;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MesaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $pedido = $this->pedidoAtivo;

        return [
            'id' => $this->id,
            'numero' => $this->numero,
            'capacidade' => $this->capacidade,
            'ativa' => (bool) $this->ativa,
            'status' => $pedido ? Mesa::STATUS_OCUPADA : Mesa::STATUS_LIVRE,
            'pedido_ativo' => $pedido ? [
                'id' => $pedido->id,
                'status' => $pedido->status,
                'total' => $pedido->total,
                'itens_count' => $pedido->itens_count ?? $pedido->itens()->count(),
                'aberto_em' => $pedido->created_at?->toIso8601String(),
            ] : null,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
