<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProdutoRequest;
use App\Http\Requests\UpdateProdutoRequest;
use App\Http\Resources\ProdutoResource;
use App\Models\Produto;
use App\Services\ProdutoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ProdutoController extends Controller
{
    public function __construct(private ProdutoService $service) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = max(1, min((int) $request->input('per_page', 15), 100));
        $filters = [
            'search' => $request->query('search'),
            'categoria' => $request->query('categoria'),
            'order' => $request->query('order'),
        ];
        $produtos = $this->service->listAll($filters, $perPage);

        return ProdutoResource::collection($produtos)->response();
    }

    /**
     * Lista as categorias já cadastradas, para alimentar o filtro no app.
     */
    public function categorias(): JsonResponse
    {
        return response()->json(['data' => $this->service->categorias()]);
    }

    public function store(StoreProdutoRequest $request): JsonResponse
    {
        $produto = $this->service->create(
            $request->validated(),
            $request->file('foto')
        );

        return (new ProdutoResource($produto))->response()->setStatusCode(201);
    }

    public function show(Produto $produto): ProdutoResource
    {
        return new ProdutoResource($produto);
    }

    public function update(UpdateProdutoRequest $request, Produto $produto): ProdutoResource
    {
        $updated = $this->service->update(
            $produto,
            $request->validated(),
            $request->file('foto'),
            $request->boolean('remover_foto'),
        );

        return new ProdutoResource($updated);
    }

    public function destroy(Produto $produto): Response
    {
        $this->service->delete($produto);

        return response()->noContent();
    }
}
