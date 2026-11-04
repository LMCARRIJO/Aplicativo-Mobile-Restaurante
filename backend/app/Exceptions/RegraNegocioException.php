<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

/**
 * Erro de regra de negocio: vira uma resposta JSON com o status informado
 * (409 por padrao) em vez de estourar um 500.
 */
class RegraNegocioException extends Exception
{
    public function __construct(string $mensagem, private int $status = 409)
    {
        parent::__construct($mensagem);
    }

    public function getStatus(): int
    {
        return $this->status;
    }

    public function render(): JsonResponse
    {
        return response()->json(['message' => $this->getMessage()], $this->status);
    }
}
