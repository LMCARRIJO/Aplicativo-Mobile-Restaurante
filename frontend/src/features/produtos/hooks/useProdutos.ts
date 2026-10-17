import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProduto,
  deleteProduto,
  getProduto,
  listProdutos,
  updateProduto,
} from '../services/produtosApi';

export const produtosKeys = {
  all: ['produtos'] as const,
  list: () => [...produtosKeys.all, 'list'] as const,
  detail: (id: number) => [...produtosKeys.all, 'detail', id] as const,
};

export function useProdutos() {
  return useQuery({ queryKey: produtosKeys.list(), queryFn: listProdutos });
}

export function useProduto(id?: number) {
  return useQuery({
    queryKey: produtosKeys.detail(id ?? 0),
    queryFn: () => getProduto(id as number),
    enabled: Boolean(id),
  });
}

export function useCreateProduto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProduto,
    onSuccess: () => qc.invalidateQueries({ queryKey: produtosKeys.all }),
  });
}

export function useUpdateProduto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dados }: { id: number; dados: Parameters<typeof updateProduto>[1] }) =>
      updateProduto(id, dados),
    onSuccess: () => qc.invalidateQueries({ queryKey: produtosKeys.all }),
  });
}

export function useDeleteProduto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProduto,
    onSuccess: () => qc.invalidateQueries({ queryKey: produtosKeys.all }),
  });
}