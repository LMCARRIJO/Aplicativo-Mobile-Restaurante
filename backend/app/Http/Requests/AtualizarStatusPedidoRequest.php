<?php

namespace App\Http\Requests;

use App\Models\Pedido;
<<<<<<< HEAD
use App\Models\User;
=======
>>>>>>> 9314932153d7875381cad1e922d8d1bdcfbb1f54
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AtualizarStatusPedidoRequest extends FormRequest
{
    public function authorize(): bool
    {
<<<<<<< HEAD
        $status = $this->string('status')->toString();
        $statusValidos = [
            Pedido::STATUS_EM_PREPARO,
            Pedido::STATUS_PRONTO,
            Pedido::STATUS_ENTREGUE,
            Pedido::STATUS_FECHADO,
            Pedido::STATUS_CANCELADO,
        ];

        if (! in_array($status, $statusValidos, true)) {
            return true;
        }

        return match ($this->user()?->role) {
            User::ROLE_ADMIN => true,
            User::ROLE_GARCOM => in_array($status, [
                Pedido::STATUS_EM_PREPARO,
                Pedido::STATUS_ENTREGUE,
                Pedido::STATUS_FECHADO,
                Pedido::STATUS_CANCELADO,
            ], true),
            User::ROLE_COZINHA => $status === Pedido::STATUS_PRONTO,
            default => false,
        };
=======
        return true;
>>>>>>> 9314932153d7875381cad1e922d8d1bdcfbb1f54
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
                    Pedido::STATUS_FECHADO,
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
