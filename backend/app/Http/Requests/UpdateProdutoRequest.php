<?php

namespace App\Http\Requests;

use App\Models\Produto;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProdutoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome' => 'sometimes|required|string|max:150',
            'preco' => 'sometimes|required|numeric|min:0|max:999999.99',
            'preco_promocional' => 'sometimes|nullable|numeric|min:0|max:999999.99',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'descricao' => 'sometimes|nullable|string|max:1000',
            'ingredientes' => 'sometimes|nullable|string|max:2000',
            'alergenicos' => 'sometimes|nullable|string|max:255',
            'porcao' => 'sometimes|nullable|integer|min:1|max:99',
            'disponivel' => 'sometimes|nullable|boolean',
            'promocao_fim' => 'sometimes|nullable|date',
            'categoria' => ['sometimes', 'nullable', 'string', 'max:80', Rule::in(Produto::CATEGORIAS)],
        ];
    }
}
