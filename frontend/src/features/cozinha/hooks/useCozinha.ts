import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mensagemErro } from '@/shared/lib/http';
import { alerta } from '@/shared/utils/dialogos';
import { listarFila, marcarComandaPronta, type FilaStatus } from '../services/cozinhaApi';

export const cozinhaKeys = {
  all: ['cozinha'] as const,
  fila: (status: FilaStatus) => [...cozinhaKeys.all, 'fila', status] as const,
};

/** A tela da cozinha não depende de puxar a lista: ela se atualiza sozinha. */
export const INTERVALO_POLLING_MS = 10_000;

export function useFilaCozinha(status: FilaStatus) {
  const query = useQuery({
    queryKey: cozinhaKeys.fila(status),
    queryFn: () => listarFila(status),
    refetchInterval: INTERVALO_POLLING_MS,
  });

  return {
    pedidos: query.data ?? [],
    loading: query.isLoading,
    refreshing: query.isFetching && !query.isLoading,
    erro: query.error ? mensagemErro(query.error) : null,
    atualizadoEm: query.dataUpdatedAt,
    reload: query.refetch,
    refresh: query.refetch,
  };
}

export function useMarcarPronto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pedidoId: number) => marcarComandaPronta(pedidoId),
    onSuccess: () => {
      // A mesa do salão e a comanda do garçom mudam junto.
      qc.invalidateQueries({ queryKey: cozinhaKeys.all });
      qc.invalidateQueries({ queryKey: ['mesas'] });
      qc.invalidateQueries({ queryKey: ['pedidos'] });
    },
    onError: (e) => alerta('Erro ao marcar como pronto', mensagemErro(e)),
  });
}
