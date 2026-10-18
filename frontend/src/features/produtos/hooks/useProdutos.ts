import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { alerta } from '@/shared/utils/dialogos';
import {
  createProduto,
  deleteProduto,
  getProduto,
  listProdutos,
  mensagemErro,
  updateProduto,
} from '../services/produtosApi';
import type { ProdutoInput } from '../types/Produto';

export const produtosKeys = {
  all: ['produtos'] as const,
  list: () => [...produtosKeys.all, 'list'] as const,
  detail: (id: number) => [...produtosKeys.all, 'detail', id] as const,
};

export function useProdutos() {
  const query = useQuery({ queryKey: produtosKeys.list(), queryFn: listProdutos });
  const excluir = useExcluirProduto();

  return {
    produtos: query.data ?? [],
    loading: query.isLoading,
    refreshing: query.isFetching && !query.isLoading,
    erro: query.error ? mensagemErro(query.error) : null,
    reload: query.refetch,
    refresh: query.refetch,
    remove: (id: number) => excluir.mutate(id),
  };
}

export function useProduto(id?: number) {
  return useQuery({
    queryKey: produtosKeys.detail(id ?? 0),
    queryFn: () => getProduto(id as number),
    enabled: typeof id === 'number' && !Number.isNaN(id),
  });
}

export function useSalvarProduto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id?: number; input: ProdutoInput }) =>
      id ? updateProduto(id, input) : createProduto(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: produtosKeys.all }),
  });
}

export function useExcluirProduto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProduto(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: produtosKeys.all }),
    onError: (e) => alerta('Erro ao excluir', mensagemErro(e)),
  });
}