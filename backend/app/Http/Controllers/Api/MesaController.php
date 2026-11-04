<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMesaRequest;
use App\Http\Requests\UpdateMesaRequest;
use App\Http\Resources\MesaResource;
use App\Models\Mesa;
use App\Services\MesaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MesaController extends Controller
{
    public function __construct(private MesaService $service) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = max(1, min((int) $request->input('per_page', 50), 100));
        $filters = [
            'status' => $request->query('status'),
            'ativa' => $request->query('ativa'),
        ];

        return MesaResource::collection($this->service->listAll($filters, $perPage))->response();
    }

    public function store(StoreMesaRequest $request): JsonResponse
    {
        $mesa = $this->service->create($request->validated())->load('pedidoAtivo');

        return (new MesaResource($mesa))->response()->setStatusCode(201);
    }

    public function show(Mesa $mesa): JsonResponse
    {
        return (new MesaResource($this->service->find($mesa->id)))->response();
    }

    public function update(UpdateMesaRequest $request, Mesa $mesa): JsonResponse
    {
        $mesa = $this->service->update($mesa, $request->validated())->load('pedidoAtivo');

        return (new MesaResource($mesa))->response();
    }

    public function destroy(Mesa $mesa): Response
    {
        $this->service->delete($mesa);

        return response()->noContent();
    }
}
