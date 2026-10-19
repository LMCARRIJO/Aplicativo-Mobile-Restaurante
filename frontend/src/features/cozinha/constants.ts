import type { Cores } from '@/shared/theme';

/** A partir daqui a comanda começa a chamar atenção na fila. */
export const MINUTOS_ATENCAO = 10;
/** A partir daqui a comanda está atrasada. */
export const MINUTOS_ATRASO = 20;

export type NivelUrgencia = 'normal' | 'atencao' | 'atrasada';

/** Classifica a espera (em minutos) para dar cor ao cartão da comanda. */
export function urgencia(minutos: number): NivelUrgencia {
  if (minutos >= MINUTOS_ATRASO) return 'atrasada';
  if (minutos >= MINUTOS_ATENCAO) return 'atencao';
  return 'normal';
}

export interface MetaUrgencia {
  /** Cor da barra lateral do cartão. */
  faixa: string;
  bg: string;
  texto: string;
  rotulo: string;
}

export function metaUrgencia(nivel: NivelUrgencia, c: Cores): MetaUrgencia {
  switch (nivel) {
    case 'atrasada':
      return {
        faixa: c.danger,
        bg: c.statusCanceladoBg,
        texto: c.statusCanceladoTexto,
        rotulo: 'Atrasada',
      };
    case 'atencao':
      return {
        faixa: c.warning,
        bg: c.statusCozinhaBg,
        texto: c.statusCozinhaTexto,
        rotulo: 'Atenção',
      };
    default:
      return {
        faixa: c.success,
        bg: c.statusProntoBg,
        texto: c.statusProntoTexto,
        rotulo: 'No prazo',
      };
  }
}
