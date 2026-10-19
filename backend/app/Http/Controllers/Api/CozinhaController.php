<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PedidoResource;
use App\Services\PedidoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Ponto de entrada do sistema da cozinha: a fila de comandas em preparo.
 */
class CozinhaController extends Controller
{
    public function __construct(private PedidoService $service) {}

    public function fila(Request $request): JsonResponse
    {
        $perPage = max(1, min((int) $request->input('per_page', 15), 100));

        return PedidoResource::collection($this->service->filaCozinha($perPage))->response();
    }
}
