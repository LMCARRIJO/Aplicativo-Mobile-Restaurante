export type StatusPedido = 'aberto' | 'em_preparo' | 'pronto' | 'entregue' | 'cancelado';

export interface PedidoItem {
  id: number;
  pedido_id: number;
  produto_id: number | null; // null se o produto saiu do cardápio
  produto_nome: string; // snapshot do nome no momento do pedido
  quantidade: number;
  preco_unitario: string; // decimal:2 vem como string do Laravel
  subtotal: string;
  observacao: string | null;
  created_at: string;
  updated_at: string;
}

export interface Pedido {
  id: number;
  mesa_id: number;
  mesa?: { id: number; numero: number };
  status: StatusPedido;
  observacao: string | null;
  total: string;
  itens: PedidoItem[];
  criado_em: string;
  atualizado_em: string;
}

export interface PaginatedPedidos {
  data: Pedido[];
  links: any;
  meta: any;
}
