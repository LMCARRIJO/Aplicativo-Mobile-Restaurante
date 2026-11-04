<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AtualizarStatusPedidoRequest;
use App\Http\Requests\StorePedidoRequest;
use App\Http\Resources\PedidoResource;
use App\Models\Mesa;
use App\Models\Pedido;
use App\Services\PedidoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PedidoController extends Controller
{
    public function __construct(private PedidoService $service) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = max(1, min((int) $request->input('per_page', 15), 100));
        $filters = [
            'status' => $request->query('status'),
            'mesa_id' => $request->query('mesa_id'),
        ];

        return PedidoResource::collection($this->service->listAll($filters, $perPage))->response();
    }

    /**
     * Abre a comanda de uma mesa.
     */
    public function store(StorePedidoRequest $request): JsonResponse
    {
        $mesa = Mesa::findOrFail($request->integer('mesa_id'));
        $pedido = $this->service->abrir($mesa, $request->validated());

        return (new PedidoResource($pedido))->response()->setStatusCode(201);
    }

    public function show(Pedido $pedido): JsonResponse
    {
        return (new PedidoResource($this->service->find($pedido->id)))->response();
    }

    /**
     * Avança o status da comanda (cozinha marca pronto, garçom marca entregue, etc).
     */
    public function atualizarStatus(AtualizarStatusPedidoRequest $request, Pedido $pedido): JsonResponse
    {
        $pedido = $this->service->alterarStatus($pedido, $request->string('status')->toString());

        return (new PedidoResource($pedido))->response();
    }

    /**
     * Manda a comanda para a cozinha.
     */
    public function enviar(Pedido $pedido): JsonResponse
    {
        $pedido = $this->service->enviarParaCozinha($pedido);

        return (new PedidoResource($pedido))->response();
    }
}
