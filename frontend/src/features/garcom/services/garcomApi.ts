import { api } from '@/shared/lib/http';
import type { Mesa, MesaInput, PaginatedMesas, StatusMesa } from '../types/Mesa';
import type { PaginatedPedidos, Pedido, StatusPedido } from '../types/Pedido';

/**
 * Chamadas do sistema do garçom (mesas e comandas).
 * As respostas do Laravel vêm embrulhadas em `data`, o helper desembrulha.
 */
function desembrulhar<T>(data: any): T {
  return (data?.data ?? data) as T;
}

async function listarTudo<T>(recurso: string, params: Record<string, unknown> = {}): Promise<T[]> {
  const todos: T[] = [];
  let page = 1;
  let lastPage = 1;

  do {
    const { data } = await api.get<any>(`/${recurso}`, { params: { page, per_page: 100, ...params } });
    const itens: T[] = Array.isArray(data) ? data : data.data ?? [];
    todos.push(...itens);
    lastPage = Array.isArray(data) ? 1 : data.meta?.last_page ?? 1;
    page += 1;
  } while (page <= lastPage);

  return todos;
}

function payloadMesa(input: MesaInput) {
  return {
    numero: Number(input.numero),
    capacidade: input.capacidade ? Number(input.capacidade) : null,
    ativa: input.ativa,
  };
}

// ---------------------------------------------------------------- mesas

export function listMesas(status: StatusMesa | 'todas' = 'todas'): Promise<Mesa[]> {
  return listarTudo<Mesa>('mesas', status === 'todas' ? {} : { status });
}

export async function getMesa(id: number): Promise<Mesa> {
  const { data } = await api.get(`/mesas/${id}`);
  return desembrulhar<Mesa>(data);
}

export async function createMesa(input: MesaInput): Promise<Mesa> {
  const { data } = await api.post('/mesas', payloadMesa(input));
  return desembrulhar<Mesa>(data);
}

export async function updateMesa(id: number, input: MesaInput): Promise<Mesa> {
  const { data } = await api.put(`/mesas/${id}`, payloadMesa(input));
  return desembrulhar<Mesa>(data);
}

export async function deleteMesa(id: number): Promise<void> {
  await api.delete(`/mesas/${id}`);
}

// ---------------------------------------------------------------- comandas

export async function abrirComanda(mesaId: number, observacao?: string): Promise<Pedido> {
  const { data } = await api.post('/pedidos', { mesa_id: mesaId, observacao: observacao ?? null });
  return desembrulhar<Pedido>(data);
}

export async function getPedido(id: number): Promise<Pedido> {
  const { data } = await api.get(`/pedidos/${id}`);
  return desembrulhar<Pedido>(data);
}

export async function listPedidos(status?: StatusPedido): Promise<Pedido[]> {
  return listarTudo<Pedido>('pedidos', status ? { status } : {});
}

export interface ItemInput {
  produto_id: number;
  quantidade: number;
  observacao?: string | null;
}

export async function adicionarItem(pedidoId: number, input: ItemInput): Promise<void> {
  await api.post(`/pedidos/${pedidoId}/itens`, input);
}

export async function atualizarItem(
  pedidoId: number,
  itemId: number,
  input: { quantidade?: number; observacao?: string | null },
): Promise<void> {
  await api.put(`/pedidos/${pedidoId}/itens/${itemId}`, input);
}

export async function removerItem(pedidoId: number, itemId: number): Promise<void> {
  await api.delete(`/pedidos/${pedidoId}/itens/${itemId}`);
}

export async function enviarComanda(pedidoId: number): Promise<Pedido> {
  const { data } = await api.post(`/pedidos/${pedidoId}/enviar`);
  return desembrulhar<Pedido>(data);
}

export async function alterarStatusPedido(pedidoId: number, status: StatusPedido): Promise<Pedido> {
  const { data } = await api.patch(`/pedidos/${pedidoId}/status`, { status });
  return desembrulhar<Pedido>(data);
}

export type { PaginatedMesas, PaginatedPedidos };
