<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\NormalizaCamposVazios;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProdutoRequest extends FormRequest
{
    use NormalizaCamposVazios;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->normalizarCamposVazios('descricao', 'categoria');
    }

    public function rules(): array
    {
        return [
            'nome' => 'sometimes|required|string|max:150',
            'preco' => 'sometimes|required|numeric|min:0|max:999999.99',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'remover_foto' => 'sometimes|boolean',
            'descricao' => 'sometimes|nullable|string|max:1000',
            'quantidade_estoque' => 'sometimes|nullable|integer|min:0',
            'data_validade' => 'sometimes|nullable|date|after:today',
            'categoria' => 'sometimes|nullable|string|max:80',
        ];
    }

    public function messages(): array
    {
        return [
            'nome.required' => 'Nome é obrigatório',
            'preco.required' => 'Preço é obrigatório',
            'foto.image' => 'Foto deve ser uma imagem válida',
        ];
    }
}
