import type { StatusPedido } from './Pedido';

export type StatusMesa = 'livre' | 'ocupada';

/** Resumo da comanda ativa que vem junto com a mesa. */
export interface PedidoAtivoResumo {
  id: number;
  status: StatusPedido;
  total: string;
  itens_count: number;
  aberto_em: string;
}

export interface Mesa {
  id: number;
  numero: number;
  capacidade: number | null;
  ativa: boolean;
  status: StatusMesa;
  pedido_ativo: PedidoAtivoResumo | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedMesas {
  data: Mesa[];
  links: any;
  meta: any;
}

export interface MesaInput {
  numero: string;
  capacidade?: string;
  ativa: boolean;
}
