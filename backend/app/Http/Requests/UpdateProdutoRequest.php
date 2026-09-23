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
            'descricao' => 'nullable|string|max:1000',
            'preco' => 'sometimes|required|numeric|min:0|max:999999.99',
            'quantidade_estoque' => 'sometimes|integer|min:0',
            'data_validade' => 'nullable|date|after:today',
            'categoria' => 'nullable|string|max:80',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ];
    }
}
