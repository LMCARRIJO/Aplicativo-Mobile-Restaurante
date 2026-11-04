<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\NormalizaCamposVazios;
use Illuminate\Foundation\Http\FormRequest;

class StoreMesaRequest extends FormRequest
{
    use NormalizaCamposVazios;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->normalizarCamposVazios('capacidade');
    }

    public function rules(): array
    {
        return [
            'numero' => 'required|integer|min:1|max:999|unique:mesas,numero',
            'capacidade' => 'nullable|integer|min:1|max:99',
            'ativa' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'numero.required' => 'Número da mesa é obrigatório',
            'numero.integer' => 'O número da mesa deve ser um número inteiro',
            'numero.min' => 'O número da mesa deve ser maior que zero',
            'numero.unique' => 'Já existe uma mesa com este número',
        ];
    }
}
