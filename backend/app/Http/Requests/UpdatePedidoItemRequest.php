<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\NormalizaCamposVazios;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePedidoItemRequest extends FormRequest
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
            'quantidade' => 'sometimes|required|integer|min:1|max:99',
            'observacao' => 'sometimes|nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'quantidade.min' => 'A quantidade mínima é 1',
        ];
    }
}
