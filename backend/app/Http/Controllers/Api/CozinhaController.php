<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PedidoResource;
use App\Models\Pedido;
use App\Services\PedidoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Ponto de entrada do sistema da cozinha: a fila de comandas.
 * `GET /api/cozinha/fila` (em preparo, padrão) e `?status=pronto` (aguardando retirada).
 */
class CozinhaController extends Controller
{
    public function __construct(private PedidoService $service) {}

    public function fila(Request $request): JsonResponse
    {
        $dados = $request->validate([
            'status' => ['sometimes', 'string', Rule::in([Pedido::STATUS_EM_PREPARO, Pedido::STATUS_PRONTO])],
        ]);

        return PedidoResource::collection(
            $this->service->filaCozinha(
                $dados['status'] ?? Pedido::STATUS_EM_PREPARO,
                max(1, min((int) $request->input('per_page', 15), 100)),
            ),
        )->response();
    }
}
