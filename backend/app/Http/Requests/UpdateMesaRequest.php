<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\NormalizaCamposVazios;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMesaRequest extends FormRequest
{
    use NormalizaCamposVazios;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->normalizarCamposVazios('capacidade');
    }

    public function rules(): array
    {
        return [
            'numero' => [
                'sometimes',
                'required',
                'integer',
                'min:1',
                'max:999',
                Rule::unique('mesas', 'numero')->ignore($this->route('mesa')),
            ],
            'capacidade' => 'sometimes|nullable|integer|min:1|max:99',
            'ativa' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'numero.required' => 'Número da mesa é obrigatório',
            'numero.min' => 'O número da mesa deve ser maior que zero',
            'numero.unique' => 'Já existe uma mesa com este número',
        ];
    }
}
