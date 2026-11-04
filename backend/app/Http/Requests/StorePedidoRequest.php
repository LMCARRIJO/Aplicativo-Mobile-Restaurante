<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\NormalizaCamposVazios;
use Illuminate\Foundation\Http\FormRequest;

class StorePedidoRequest extends FormRequest
{
    use NormalizaCamposVazios;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->normalizarCamposVazios('observacao');
    }

    public function rules(): array
    {
        return [
            'mesa_id' => 'required|integer|exists:mesas,id',
            'observacao' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'mesa_id.required' => 'Informe a mesa da comanda',
            'mesa_id.exists' => 'Mesa não encontrada',
        ];
    }
}
