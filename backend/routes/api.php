<?php

use App\Http\Controllers\Api\ProdutoController;
use Illuminate\Support\Facades\Route;

Route::apiResource('produtos', ProdutoController::class);

// Health check
Route::get('/health', fn () => response()->json(['status' => 'ok']));
