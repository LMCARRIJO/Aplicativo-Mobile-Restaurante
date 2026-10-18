<?php

namespace App\Http\Requests\Concerns;

trait NormalizaCamposVazios
{
    /**
     * Converte strings vazias (ou só espaços) em null para os campos opcionais
     * informados. Só age em campos realmente enviados, preservando a semântica
     * de atualização parcial: campos ausentes continuam ausentes.
     */
    protected function normalizarCamposVazios(string ...$campos): void
    {
        $dados = [];

        foreach ($campos as $campo) {
            if (! $this->exists($campo)) {
                continue;
            }

            $valor = $this->input($campo);

            if (is_string($valor) && trim($valor) === '') {
                $dados[$campo] = null;
            }
        }

        if ($dados) {
            $this->merge($dados);
        }
    }
}
