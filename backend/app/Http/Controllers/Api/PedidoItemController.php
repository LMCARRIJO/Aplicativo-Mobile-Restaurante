<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePedidoItemRequest;
use App\Http\Requests\UpdatePedidoItemRequest;
use App\Http\Resources\PedidoItemResource;
use App\Models\Pedido;
use App\Models\PedidoItem;
use App\Services\PedidoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class PedidoItemController extends Controller
{
    public function __construct(private PedidoService $service) {}

    public function store(StorePedidoItemRequest $request, Pedido $pedido): JsonResponse
    {
        $item = $this->service->adicionarItem($pedido, $request->validated());

        return (new PedidoItemResource($item))->response()->setStatusCode(201);
    }

    public function update(UpdatePedidoItemRequest $request, Pedido $pedido, PedidoItem $item): JsonResponse
    {
        $item = $this->service->atualizarItem($pedido, $item, $request->validated());

        return (new PedidoItemResource($item))->response();
    }

    public function destroy(Pedido $pedido, PedidoItem $item): Response
    {
        $this->service->removerItem($pedido, $item);

        return response()->noContent();
    }
}
