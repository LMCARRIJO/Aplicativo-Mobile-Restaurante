import type { Cores } from '@/shared/theme';
import type { StatusPedido } from './types/Pedido';

/** Rótulos que o garçom vê. */
export const ROTULO_STATUS: Record<StatusPedido, string> = {
  aberto: 'Aberta',
  em_preparo: 'Na cozinha',
  pronto: 'Pronto',
  entregue: 'Entregue',
  cancelado: 'Cancelada',
};

/** Texto de apoio mostrado na comanda. */
export const DESCRICAO_STATUS: Record<StatusPedido, string> = {
  aberto: 'Anote os itens e envie para a cozinha.',
  em_preparo: 'A cozinha está preparando esta comanda.',
  pronto: 'Pronto para levar até a mesa.',
  entregue: 'Comanda entregue. A mesa está livre.',
  cancelado: 'Comanda cancelada. A mesa está livre.',
};

export function metaStatus(status: StatusPedido, c: Cores): { bg: string; texto: string } {
  switch (status) {
    case 'em_preparo':
      return { bg: c.statusCozinhaBg, texto: c.statusCozinhaTexto };
    case 'pronto':
      return { bg: c.statusProntoBg, texto: c.statusProntoTexto };
    case 'entregue':
      return { bg: c.statusEntregueBg, texto: c.statusEntregueTexto };
    case 'cancelado':
      return { bg: c.statusCanceladoBg, texto: c.statusCanceladoTexto };
    default:
      return { bg: c.statusAbertoBg, texto: c.statusAbertoTexto };
  }
}

/** Uma comanda entregue ou cancelada não ocupa mais a mesa. */
export function statusFinal(status: StatusPedido): boolean {
  return status === 'entregue' || status === 'cancelado';
}

/** Tempo decorrido desde a abertura, ex.: "12 min". */
export function tempoDecorrido(desde?: string | null): string {
  if (!desde) return '';
  const inicio = new Date(desde).getTime();
  if (Number.isNaN(inicio)) return '';
  const minutos = Math.max(0, Math.floor((Date.now() - inicio) / 60000));
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  return `${horas}h${String(minutos % 60).padStart(2, '0')}`;
}
