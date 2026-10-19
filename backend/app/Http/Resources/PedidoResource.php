<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PedidoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'mesa_id' => $this->mesa_id,
            'mesa' => $this->whenLoaded('mesa', fn () => [
                'id' => $this->mesa->id,
                'numero' => $this->mesa->numero,
            ]),
            'status' => $this->status,
            'observacao' => $this->observacao,
            'total' => $this->total,
            'itens' => PedidoItemResource::collection($this->whenLoaded('itens')),
            'criado_em' => $this->created_at?->toIso8601String(),
            'enviado_em' => $this->enviado_em?->toIso8601String(),
            'pronto_em' => $this->pronto_em?->toIso8601String(),
            'atualizado_em' => $this->updated_at?->toIso8601String(),
        ];
    }
}
