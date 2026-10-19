<?php

namespace App\Http\Requests;

use App\Models\Pedido;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AtualizarStatusPedidoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => [
                'required',
                Rule::in([
                    Pedido::STATUS_EM_PREPARO,
                    Pedido::STATUS_PRONTO,
                    Pedido::STATUS_ENTREGUE,
                    Pedido::STATUS_CANCELADO,
                ]),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Informe o novo status da comanda',
            'status.in' => 'Status inválido para a comanda',
        ];
    }
}
