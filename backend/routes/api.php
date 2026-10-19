<?php

use App\Http\Controllers\Api\CozinhaController;
use App\Http\Controllers\Api\MesaController;
use App\Http\Controllers\Api\PedidoController;
use App\Http\Controllers\Api\PedidoItemController;
use App\Http\Controllers\Api\ProdutoController;
use Illuminate\Support\Facades\Route;

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
