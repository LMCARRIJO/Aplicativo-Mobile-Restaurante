<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Autentica o usuário e devolve um token de acesso pessoal.
     */
    public function login(Request $request): JsonResponse
    {
        $dados = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $usuario = User::where('email', $dados['email'])->first();

        if (! $usuario || ! Hash::check($dados['password'], $usuario->password)) {
            return response()->json(['message' => 'Credenciais inválidas.'], 401);
        }

        $token = $usuario->createToken('expo-mobile')->plainTextToken;

        return response()->json([
            'data' => [
                'token' => $token,
                'token_type' => 'Bearer',
                'usuario' => (new UserResource($usuario))->resolve(),
            ],
        ]);
    }

    /**
     * Devolve o usuário dono do token atual.
     */
    public function me(Request $request): JsonResponse
    {
        return (new UserResource($request->user()))->response();
    }

    /**
     * Revoga apenas o token usado nesta requisição.
     */
    public function logout(Request $request): Response
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }
}
