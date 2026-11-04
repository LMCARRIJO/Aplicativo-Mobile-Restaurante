import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { mensagemErro } from '@/shared/lib/http';
import { alerta } from '@/shared/utils/dialogos';
import {
  abrirComanda,
  adicionarItem,
  alterarStatusPedido,
  atualizarItem,
  enviarComanda,
  getPedido,
  removerItem,
  type ItemInput,
} from '../services/garcomApi';
import type { Pedido, StatusPedido } from '../types/Pedido';

export const comandaKeys = {
  all: ['pedidos'] as const,
  detail: (id: number) => [...comandaKeys.all, 'detail', id] as const,
};

/** Mexeu na comanda, a mesa e a lista de comandas mudam junto. */
function invalidarComandas(qc: QueryClient) {
  qc.invalidateQueries({ queryKey: ['mesas'] });
  qc.invalidateQueries({ queryKey: comandaKeys.all });
  qc.invalidateQueries({ queryKey: ['cozinha'] });
}

export function usePedido(id?: number) {
  return useQuery({
    queryKey: comandaKeys.detail(id ?? 0),
    queryFn: () => getPedido(id as number),
    enabled: typeof id === 'number' && !Number.isNaN(id),
  });
}

export function useAbrirComanda(mesaId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (observacao?: string) => abrirComanda(mesaId, observacao),
    onSuccess: () => invalidarComandas(qc),
    onError: (e) => alerta('Erro ao abrir comanda', mensagemErro(e)),
  });
}

export function useItensComanda(pedidoId?: number) {
  const qc = useQueryClient();
  const falhou = (e: unknown) => alerta('Erro na comanda', mensagemErro(e));

  const adicionar = useMutation({
    mutationFn: (input: ItemInput) => adicionarItem(pedidoId as number, input),
    onSuccess: () => invalidarComandas(qc),
    onError: falhou,
  });

  const atualizar = useMutation({
    mutationFn: ({ itemId, input }: { itemId: number; input: { quantidade?: number; observacao?: string | null } }) =>
      atualizarItem(pedidoId as number, itemId, input),
    onSuccess: () => invalidarComandas(qc),
    onError: falhou,
  });

  const remover = useMutation({
    mutationFn: (itemId: number) => removerItem(pedidoId as number, itemId),
    onSuccess: () => invalidarComandas(qc),
    onError: falhou,
  });

  return { adicionar, atualizar, remover };
}

export function useEnviarComanda(pedidoId?: number) {
  const qc = useQueryClient();
  return useMutation<Pedido, unknown, void>({
    mutationFn: () => enviarComanda(pedidoId as number),
    onSuccess: () => invalidarComandas(qc),
    onError: (e) => alerta('Erro ao enviar para a cozinha', mensagemErro(e)),
  });
}

export function useStatusComanda(pedidoId?: number) {
  const qc = useQueryClient();
  return useMutation<Pedido, unknown, StatusPedido>({
    mutationFn: (status: StatusPedido) => alterarStatusPedido(pedidoId as number, status),
    onSuccess: () => invalidarComandas(qc),
    onError: (e) => alerta('Erro ao mudar o status', mensagemErro(e)),
  });
}
