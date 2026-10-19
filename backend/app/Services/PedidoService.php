<?php

namespace App\Services;

use App\Exceptions\RegraNegocioException;
use App\Models\Mesa;
use App\Models\Pedido;
use App\Models\PedidoItem;
use App\Models\Produto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PedidoService
{
    private const RELACOES = ['mesa:id,numero', 'itens'];

    /**
     * Histórico/fila de comandas, com filtro por status e por mesa.
     */
    public function listAll(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $status = $filters['status'] ?? null;
        $mesaId = $filters['mesa_id'] ?? null;

        return Pedido::query()
            ->with(self::RELACOES)
            ->when($status, fn ($query) => $query->where('status', $status))
            ->when($mesaId, fn ($query) => $query->where('mesa_id', $mesaId))
            ->latest('id')
            ->paginate($perPage);
    }

    public function find(int $id): Pedido
    {
        return Pedido::query()->with(self::RELACOES)->findOrFail($id);
    }

    /**
     * Abre a comanda de uma mesa. Só uma comanda ativa por mesa.
     */
    public function abrir(Mesa $mesa, array $data): Pedido
    {
        if (! $mesa->ativa) {
            throw new RegraNegocioException('Esta mesa está inativa.');
        }

        if ($mesa->estaOcupada()) {
            throw new RegraNegocioException('Esta mesa já tem uma comanda ativa.');
        }

        $pedido = $mesa->pedidos()->create([
            'status' => Pedido::STATUS_ABERTO,
            'observacao' => $data['observacao'] ?? null,
            'total' => 0,
        ]);

        return $pedido->load(self::RELACOES);
    }

    /**
     * Adiciona um prato na comanda guardando nome e preço do momento (snapshot).
     */
    public function adicionarItem(Pedido $pedido, array $data): PedidoItem
    {
        $this->garantirComandaAberta($pedido);

        $produto = Produto::findOrFail($data['produto_id']);

        $item = $pedido->itens()->create([
            'produto_id' => $produto->id,
            'produto_nome' => $produto->nome,
            'quantidade' => $data['quantidade'],
            'preco_unitario' => $produto->precoVigente(),
            'observacao' => $data['observacao'] ?? null,
        ]);

        $this->recalcularTotal($pedido);

        return $item;
    }

    public function atualizarItem(Pedido $pedido, PedidoItem $item, array $data): PedidoItem
    {
        $this->garantirComandaAberta($pedido);
        $this->garantirItemDaComanda($pedido, $item);

        $item->update($data);
        $this->recalcularTotal($pedido);

        return $item->refresh();
    }

    public function removerItem(Pedido $pedido, PedidoItem $item): void
    {
        $this->garantirComandaAberta($pedido);
        $this->garantirItemDaComanda($pedido, $item);

        $item->delete();
        $this->recalcularTotal($pedido);
    }

    /**
     * Envia a comanda para a cozinha (aberto -> em_preparo).
     */
    public function enviarParaCozinha(Pedido $pedido): Pedido
    {
        if (! $pedido->estaAberto()) {
            throw new RegraNegocioException('Só comandas abertas podem ser enviadas para a cozinha.');
        }

        if (! $pedido->itens()->exists()) {
            throw new RegraNegocioException('Adicione ao menos um item antes de enviar a comanda.');
        }

        return $this->transicionar($pedido, Pedido::STATUS_EM_PREPARO);
    }

    /**
     * Avança o status da comanda validando as transições permitidas.
     */
    public function alterarStatus(Pedido $pedido, string $novoStatus): Pedido
    {
        // Enviar para a cozinha tem regra própria (exige pelo menos um item).
        if ($novoStatus === Pedido::STATUS_EM_PREPARO) {
            return $this->enviarParaCozinha($pedido);
        }

        if (! $pedido->podeTransicionarPara($novoStatus)) {
            throw new RegraNegocioException(
                "Não é possível mudar a comanda de \"{$pedido->status}\" para \"{$novoStatus}\".",
            );
        }

        return $this->transicionar($pedido, $novoStatus);
    }

    /**
     * Fila que o sistema da cozinha consome (comandas em preparo, mais antigas primeiro).
     */
    public function filaCozinha(int $perPage = 15): LengthAwarePaginator
    {
        return Pedido::query()
            ->where('status', Pedido::STATUS_EM_PREPARO)
            ->with(self::RELACOES)
            ->oldest('id')
            ->paginate($perPage);
    }

    private function transicionar(Pedido $pedido, string $status): Pedido
    {
        $pedido->update(['status' => $status]);

        return $pedido->refresh()->load(self::RELACOES);
    }

    private function recalcularTotal(Pedido $pedido): void
    {
        $total = $pedido->itens()->get()->sum(
            fn (PedidoItem $item) => ((float) $item->preco_unitario) * $item->quantidade,
        );

        $pedido->update(['total' => round($total, 2)]);
    }

    private function garantirComandaAberta(Pedido $pedido): void
    {
        if (! $pedido->estaAberto()) {
            throw new RegraNegocioException('Esta comanda já foi enviada para a cozinha e não pode mais ser alterada.');
        }
    }

    private function garantirItemDaComanda(Pedido $pedido, PedidoItem $item): void
    {
        if ($item->pedido_id !== $pedido->id) {
            throw new RegraNegocioException('Este item não pertence a esta comanda.', 404);
        }
    }
}
