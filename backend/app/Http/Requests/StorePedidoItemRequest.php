<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\NormalizaCamposVazios;
use Illuminate\Foundation\Http\FormRequest;

class StorePedidoItemRequest extends FormRequest
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
            'produto_id' => 'required|integer|exists:produtos,id',
            'quantidade' => 'required|integer|min:1|max:99',
            'observacao' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'produto_id.required' => 'Escolha um item do cardápio',
            'produto_id.exists' => 'Produto não encontrado no cardápio',
            'quantidade.required' => 'Informe a quantidade',
            'quantidade.min' => 'A quantidade mínima é 1',
        ];
    }
}
