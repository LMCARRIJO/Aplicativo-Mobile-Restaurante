<?php

namespace App\Services;

use App\Exceptions\RegraNegocioException;
use App\Models\Mesa;
use App\Models\Pedido;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class MesaService
{
    /**
     * Lista as mesas com o status (livre/ocupada) e a comanda ativa resumida.
     */
    public function listAll(array $filters = [], int $perPage = 50): LengthAwarePaginator
    {
        $status = $filters['status'] ?? null;
        $ativa = $filters['ativa'] ?? null;

        return Mesa::query()
            ->with(['pedidoAtivo' => fn ($query) => $query->withCount('itens')])
            ->when($ativa !== null && $ativa !== '', fn ($query) => $query->where('ativa', filter_var($ativa, FILTER_VALIDATE_BOOL)))
            ->when($status === Mesa::STATUS_LIVRE, fn ($query) => $query->whereDoesntHave(
                'pedidos',
                fn ($sub) => $sub->whereIn('status', Pedido::STATUS_ATIVOS),
            ))
            ->when($status === Mesa::STATUS_OCUPADA, fn ($query) => $query->whereHas(
                'pedidos',
                fn ($sub) => $sub->whereIn('status', Pedido::STATUS_ATIVOS),
            ))
            ->orderBy('numero')
            ->paginate($perPage);
    }

    public function find(int $id): Mesa
    {
        return Mesa::query()
            ->with(['pedidoAtivo' => fn ($query) => $query->with(['itens', 'mesa:id,numero'])])
            ->findOrFail($id);
    }

    public function create(array $data): Mesa
    {
        return Mesa::create($data);
    }

    public function update(Mesa $mesa, array $data): Mesa
    {
        $mesa->update($data);

        return $mesa->refresh();
    }

    public function delete(Mesa $mesa): void
    {
        if ($mesa->estaOcupada()) {
            throw new RegraNegocioException('Esta mesa tem uma comanda ativa. Cancele a comanda antes de excluir a mesa.');
        }

        $mesa->delete();
    }
}
