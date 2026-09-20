<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProdutoRequest;
use App\Http\Requests\UpdateProdutoRequest;
use App\Http\Resources\ProdutoResource;
use App\Models\Produto;
use App\Services\ProdutoService;
use Illuminate\Http\JsonResponse;

class ProdutoController extends Controller
{
    public function __construct(private ProdutoService $service) {}

    public function index(): JsonResponse
    {
        $produtos = $this->service->listAll();
        return ProdutoResource::collection($produtos)->response();
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
            $request->file('foto')
        );
        return new ProdutoResource($updated);
    }

    public function destroy(Produto $produto): JsonResponse
    {
        $this->service->delete($produto);
        return response()->json(null, 204);
    }
}
