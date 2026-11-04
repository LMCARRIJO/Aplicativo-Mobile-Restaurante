<?php

<<<<<<< HEAD
use App\Http\Controllers\Api\AuthController;
=======
>>>>>>> 9314932153d7875381cad1e922d8d1bdcfbb1f54
use App\Http\Controllers\Api\CozinhaController;
use App\Http\Controllers\Api\MesaController;
use App\Http\Controllers\Api\PedidoController;
use App\Http\Controllers\Api\PedidoItemController;
use App\Http\Controllers\Api\ProdutoController;
use Illuminate\Support\Facades\Route;

<<<<<<< HEAD
Route::post('login', [AuthController::class, 'login'])->middleware('throttle:6,1');
Route::get('/health', fn () => response()->json(['status' => 'ok']));

Route::middleware('auth:sanctum')->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);

    Route::middleware('role:admin,garcom')->group(function () {
        // Rotas estáticas antes de {produto} para não colidirem
        Route::get('produtos/categorias', [ProdutoController::class, 'categorias']);
        Route::get('produtos', [ProdutoController::class, 'index']);
        Route::get('produtos/{produto}', [ProdutoController::class, 'show']);

        Route::get('mesas', [MesaController::class, 'index']);
        Route::get('mesas/{mesa}', [MesaController::class, 'show']);

        Route::apiResource('pedidos', PedidoController::class)->only(['index', 'store']);
        Route::post('pedidos/{pedido}/enviar', [PedidoController::class, 'enviar']);
        Route::post('pedidos/{pedido}/itens', [PedidoItemController::class, 'store']);
        Route::put('pedidos/{pedido}/itens/{item}', [PedidoItemController::class, 'update']);
        Route::delete('pedidos/{pedido}/itens/{item}', [PedidoItemController::class, 'destroy']);
    });

    Route::middleware('role:admin')->group(function () {
        Route::post('produtos', [ProdutoController::class, 'store']);
        Route::put('produtos/{produto}', [ProdutoController::class, 'update']);
        Route::patch('produtos/{produto}', [ProdutoController::class, 'update']);
        Route::delete('produtos/{produto}', [ProdutoController::class, 'destroy']);

        Route::post('mesas', [MesaController::class, 'store']);
        Route::put('mesas/{mesa}', [MesaController::class, 'update']);
        Route::patch('mesas/{mesa}', [MesaController::class, 'update']);
        Route::delete('mesas/{mesa}', [MesaController::class, 'destroy']);
    });

    Route::middleware('role:admin,garcom,cozinha')->group(function () {
        Route::get('pedidos/{pedido}', [PedidoController::class, 'show']);
        Route::patch('pedidos/{pedido}/status', [PedidoController::class, 'atualizarStatus']);
    });

    Route::middleware('role:admin,cozinha')->group(function () {
        Route::get('cozinha/fila', [CozinhaController::class, 'fila']);
    });
});
=======
// Rotas estáticas antes dos resources para não colidirem com {id}
Route::get('produtos/categorias', [ProdutoController::class, 'categorias']);
Route::get('cozinha/fila', [CozinhaController::class, 'fila']);

Route::apiResource('produtos', ProdutoController::class);
Route::apiResource('mesas', MesaController::class);

// Comandas do garçom
Route::apiResource('pedidos', PedidoController::class)->only(['index', 'store', 'show']);
Route::post('pedidos/{pedido}/enviar', [PedidoController::class, 'enviar']);
Route::patch('pedidos/{pedido}/status', [PedidoController::class, 'atualizarStatus']);
Route::post('pedidos/{pedido}/itens', [PedidoItemController::class, 'store']);
Route::put('pedidos/{pedido}/itens/{item}', [PedidoItemController::class, 'update']);
Route::delete('pedidos/{pedido}/itens/{item}', [PedidoItemController::class, 'destroy']);

// Health check
Route::get('/health', fn () => response()->json(['status' => 'ok']));
>>>>>>> 9314932153d7875381cad1e922d8d1bdcfbb1f54
