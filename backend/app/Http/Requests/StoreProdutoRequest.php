<?php

namespace App\Http\Requests;

use App\Models\Produto;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProdutoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome' => 'required|string|max:150',
            'preco' => 'required|numeric|min:0|max:999999.99',
            'preco_promocional' => 'nullable|numeric|min:0|max:999999.99',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'descricao' => 'nullable|string|max:1000',
            'ingredientes' => 'nullable|string|max:2000',
            'alergenicos' => 'nullable|string|max:255',
            'porcao' => 'nullable|integer|min:1|max:99',
            'disponivel' => 'nullable|boolean',
            'promocao_fim' => 'nullable|date',
            'categoria' => ['nullable', 'string', 'max:80', Rule::in(Produto::CATEGORIAS)],
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
