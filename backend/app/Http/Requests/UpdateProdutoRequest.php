<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            // Você descomenta aqui também quando liberar os novos campos
            // 'descricao' => 'nullable|string|max:1000',
            // 'quantidade_estoque' => 'sometimes|integer|min:0',
            // 'data_validade' => 'nullable|date|after:today',
            // 'categoria' => 'nullable|string|max:80',
        ];
    }
}
