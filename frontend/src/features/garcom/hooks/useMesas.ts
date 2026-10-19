import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mensagemErro } from '@/shared/lib/http';
import { alerta } from '@/shared/utils/dialogos';
import { createMesa, deleteMesa, getMesa, listMesas, updateMesa } from '../services/garcomApi';
import type { MesaInput, StatusMesa } from '../types/Mesa';

export const mesasKeys = {
  all: ['mesas'] as const,
  list: (filtro: StatusMesa | 'todas') => [...mesasKeys.all, 'list', filtro] as const,
  detail: (id: number) => [...mesasKeys.all, 'detail', id] as const,
};

export function useMesas(filtro: StatusMesa | 'todas' = 'todas') {
  const query = useQuery({ queryKey: mesasKeys.list(filtro), queryFn: () => listMesas(filtro) });
  const excluir = useExcluirMesa();

  return {
    mesas: query.data ?? [],
    loading: query.isLoading,
    refreshing: query.isFetching && !query.isLoading,
    erro: query.error ? mensagemErro(query.error) : null,
    reload: query.refetch,
    refresh: query.refetch,
    remove: (id: number) => excluir.mutate(id),
  };
}

export function useMesa(id?: number) {
  return useQuery({
    queryKey: mesasKeys.detail(id ?? 0),
    queryFn: () => getMesa(id as number),
    enabled: typeof id === 'number' && !Number.isNaN(id),
  });
}

export function useSalvarMesa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id?: number; input: MesaInput }) =>
      id ? updateMesa(id, input) : createMesa(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: mesasKeys.all }),
  });
}

export function useExcluirMesa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMesa(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: mesasKeys.all }),
    onError: (e) => alerta('Erro ao excluir mesa', mensagemErro(e)),
  });
}
