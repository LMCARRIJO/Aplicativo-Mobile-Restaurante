<?php

namespace App\Services;

use App\Exceptions\RegraNegocioException;
use App\Models\Mesa;
use App\Models\Pedido;
use App\Models\PedidoItem;
use App\Models\Produto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PedidoService
{
    private const RELACOES = ['mesa:id,numero', 'itens'];

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

    public function adicionarItem(Pedido $pedido, array $data): PedidoItem
    {
        $this->garantirComandaRecebeItens($pedido);

        $produto = Produto::findOrFail($data['produto_id']);

        return DB::transaction(function () use ($pedido, $produto, $data) {
            if ($pedido->status === Pedido::STATUS_ENTREGUE) {
                $pedido->update([
                    'status' => Pedido::STATUS_ABERTO,
                    'enviado_em' => null,
                    'pronto_em' => null,
                ]);
            }

            $item = $pedido->itens()->create([
                'produto_id' => $produto->id,
                'produto_nome' => $produto->nome,
                'quantidade' => $data['quantidade'],
                'preco_unitario' => $produto->precoVigente(),
                'observacao' => $data['observacao'] ?? null,
                'status' => PedidoItem::STATUS_PENDENTE,
            ]);

            $this->recalcularTotal($pedido);

            return $item;
        });
    }

    public function atualizarItem(Pedido $pedido, PedidoItem $item, array $data): PedidoItem
    {
        $this->garantirComandaAberta($pedido);
        $this->garantirItemDaComanda($pedido, $item);
        $this->garantirItemPendente($item);

        return DB::transaction(function () use ($pedido, $item, $data) {
            $item->update($data);
            $this->recalcularTotal($pedido);

            return $item->refresh();
        });
    }

    public function removerItem(Pedido $pedido, PedidoItem $item): void
    {
        $this->garantirComandaAberta($pedido);
        $this->garantirItemDaComanda($pedido, $item);
        $this->garantirItemPendente($item);

        DB::transaction(function () use ($pedido, $item) {
            $item->delete();
            $this->recalcularTotal($pedido);
            $this->recalcularStatusAposRemocao($pedido);
        });
    }

    public function enviarParaCozinha(Pedido $pedido): Pedido
    {
        if (! $pedido->estaAberto()) {
            throw new RegraNegocioException('Só comandas abertas podem ser enviadas para a cozinha.');
        }

        if (! $pedido->itens()->where('status', PedidoItem::STATUS_PENDENTE)->exists()) {
            throw new RegraNegocioException('Adicione ao menos um item antes de enviar a comanda.');
        }

        return DB::transaction(function () use ($pedido) {
            $pedido->itens()
                ->where('status', PedidoItem::STATUS_PENDENTE)
                ->update(['status' => PedidoItem::STATUS_EM_PREPARO]);

            return $this->transicionar($pedido, Pedido::STATUS_EM_PREPARO, [
                'enviado_em' => now(),
                'pronto_em' => null,
            ]);
        });
    }

    public function alterarStatus(Pedido $pedido, string $novoStatus): Pedido
    {
        if ($pedido->status === $novoStatus) {
            return $pedido->load(self::RELACOES);
        }

        if ($novoStatus === Pedido::STATUS_EM_PREPARO) {
            return $this->enviarParaCozinha($pedido);
        }

        if (! $pedido->podeTransicionarPara($novoStatus)) {
            throw new RegraNegocioException(
                "Não é possível mudar a comanda de \"{$pedido->status}\" para \"{$novoStatus}\".",
            );
        }

        return DB::transaction(function () use ($pedido, $novoStatus) {
            if ($novoStatus === Pedido::STATUS_PRONTO) {
                $pedido->itens()
                    ->where('status', PedidoItem::STATUS_EM_PREPARO)
                    ->update(['status' => PedidoItem::STATUS_PRONTO]);

                return $this->transicionar($pedido, $novoStatus, ['pronto_em' => now()]);
            }

            if ($novoStatus === Pedido::STATUS_ENTREGUE) {
                $pedido->itens()
                    ->where('status', PedidoItem::STATUS_PRONTO)
                    ->update(['status' => PedidoItem::STATUS_ENTREGUE]);

                return $this->transicionar($pedido, $novoStatus);
            }

            if ($novoStatus === Pedido::STATUS_FECHADO) {
                $this->garantirTodosItensEntregues($pedido);

                return $this->transicionar($pedido, $novoStatus, ['fechado_em' => now()]);
            }

            if ($novoStatus === Pedido::STATUS_CANCELADO) {
                $this->garantirSemItensEntregues($pedido);

                $pedido->itens()
                    ->whereIn('status', [
                        PedidoItem::STATUS_PENDENTE,
                        PedidoItem::STATUS_EM_PREPARO,
                        PedidoItem::STATUS_PRONTO,
                    ])
                    ->update(['status' => PedidoItem::STATUS_CANCELADO]);

                return $this->transicionar($pedido, $novoStatus);
            }

            return $this->transicionar($pedido, $novoStatus);
        });
    }

    public function filaCozinha(string $status = Pedido::STATUS_EM_PREPARO, int $perPage = 15): LengthAwarePaginator
    {
        $ordenacao = $status === Pedido::STATUS_PRONTO ? 'pronto_em' : 'enviado_em';

        return Pedido::query()
            ->where('status', $status)
            ->whereHas('itens', fn ($query) => $query->where('status', $status))
            ->with([
                'mesa:id,numero',
                'itens' => fn ($query) => $query->where('status', $status),
            ])
            ->orderBy($ordenacao)
            ->orderBy('id')
            ->paginate($perPage);
    }

    private function transicionar(Pedido $pedido, string $status, array $extras = []): Pedido
    {
        $pedido->update(['status' => $status, ...$extras]);

        return $pedido->refresh()->load(self::RELACOES);
    }

    private function recalcularTotal(Pedido $pedido): void
    {
        $total = $pedido->itens()->get()->sum(
            fn (PedidoItem $item) => ((float) $item->preco_unitario) * $item->quantidade,
        );

        $pedido->update(['total' => round($total, 2)]);
    }

    private function recalcularStatusAposRemocao(Pedido $pedido): void
    {
        $pedido->refresh();

        if ($pedido->status !== Pedido::STATUS_ABERTO) {
            return;
        }

        if ($pedido->itens()->where('status', PedidoItem::STATUS_PENDENTE)->exists()) {
            return;
        }

        if ($pedido->itens()->where('status', PedidoItem::STATUS_ENTREGUE)->exists()) {
            $pedido->update([
                'status' => Pedido::STATUS_ENTREGUE,
                'enviado_em' => null,
                'pronto_em' => null,
            ]);
        }
    }

    private function garantirComandaRecebeItens(Pedido $pedido): void
    {
        if (! in_array($pedido->status, [Pedido::STATUS_ABERTO, Pedido::STATUS_ENTREGUE], true)) {
            throw new RegraNegocioException('Esta comanda não está aberta para novos itens.');
        }
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

    private function garantirItemPendente(PedidoItem $item): void
    {
        if ($item->status !== PedidoItem::STATUS_PENDENTE) {
            throw new RegraNegocioException('Só é possível alterar itens que ainda não foram enviados à cozinha.');
        }
    }

    private function garantirTodosItensEntregues(Pedido $pedido): void
    {
        if ($pedido->itens()->where('status', '!=', PedidoItem::STATUS_ENTREGUE)->exists()) {
            throw new RegraNegocioException('Todos os itens precisam ser entregues antes de fechar a conta.');
        }
    }

    private function garantirSemItensEntregues(Pedido $pedido): void
    {
        if ($pedido->itens()->where('status', PedidoItem::STATUS_ENTREGUE)->exists()) {
            throw new RegraNegocioException('Esta conta já tem itens entregues e deve ser fechada, não cancelada.');
        }
    }
}
