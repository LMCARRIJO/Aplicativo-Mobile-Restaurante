<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\NormalizaCamposVazios;
use App\Models\Produto;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProdutoRequest extends FormRequest
{
    use NormalizaCamposVazios;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->normalizarCamposVazios(
            'descricao',
            'categoria',
            'preco_promocional',
            'ingredientes',
            'alergenicos',
            'porcao',
            'promocao_fim',
        );
    }

    public function rules(): array
    {
        return [
            'nome' => 'sometimes|required|string|max:150',
            'preco' => 'sometimes|required|numeric|min:0|max:999999.99',
            'preco_promocional' => 'sometimes|nullable|numeric|min:0|max:999999.99',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'remover_foto' => 'sometimes|boolean',
            'descricao' => 'sometimes|nullable|string|max:1000',
            'ingredientes' => 'sometimes|nullable|string|max:2000',
            'alergenicos' => 'sometimes|nullable|string|max:255',
            'porcao' => 'sometimes|nullable|integer|min:1|max:99',
            'disponivel' => 'sometimes|boolean',
            'promocao_fim' => 'sometimes|nullable|date',
            'categoria' => ['sometimes', 'nullable', 'string', 'max:80', Rule::in(Produto::CATEGORIAS)],
        ];
    }

    public function messages(): array
    {
        return [
            'nome.required' => 'Nome é obrigatório',
            'preco.required' => 'Preço é obrigatório',
            'foto.image' => 'Foto deve ser uma imagem válida',
            'categoria.in' => 'Categoria inválida para o cardápio',
            'porcao.min' => 'A porção deve servir ao menos 1 pessoa',
        ];
    }
}