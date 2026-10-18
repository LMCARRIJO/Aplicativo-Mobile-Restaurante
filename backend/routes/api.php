<?php

use App\Http\Controllers\Api\ProdutoController;
use Illuminate\Support\Facades\Route;

// Rota estática antes do resource para não colidir com produtos/{produto}
Route::get('produtos/categorias', [ProdutoController::class, 'categorias']);

Route::apiResource('produtos', ProdutoController::class);

// Health check
Route::get('/health', fn () => response()->json(['status' => 'ok']));
