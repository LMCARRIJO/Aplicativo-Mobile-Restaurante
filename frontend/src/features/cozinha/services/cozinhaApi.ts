import type { Pedido } from '@/features/garcom/types/Pedido';
import { api } from '@/shared/lib/http';

/** Status que a cozinha acompanha: em preparo e prontas para retirada. */
export type FilaStatus = 'em_preparo' | 'pronto';

function desembrulhar<T>(data: any): T {
  return (data?.data ?? data) as T;
}

/** Fila da cozinha, das comandas mais antigas para as mais novas. */
export async function listarFila(status: FilaStatus): Promise<Pedido[]> {
  const { data } = await api.get('/cozinha/fila', { params: { status, per_page: 100 } });
  return Array.isArray(data) ? data : data?.data ?? [];
}

/** A cozinha terminou a comanda: ela sai da fila e vira "aguardando retirada". */
export async function marcarComandaPronta(pedidoId: number): Promise<Pedido> {
  const { data } = await api.patch(`/pedidos/${pedidoId}/status`, { status: 'pronto' });
  return desembrulhar<Pedido>(data);
}
