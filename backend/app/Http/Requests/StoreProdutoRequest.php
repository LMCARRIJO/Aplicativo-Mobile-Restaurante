<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            // Adiciona suas validações aqui depois que criar sua migration.
            // 'descricao' => 'nullable|string|max:1000',
            // 'quantidade_estoque' => 'required|integer|min:0',
            // 'data_validade' => 'nullable|date|after:today',
            // 'categoria' => 'nullable|string|max:80',
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
