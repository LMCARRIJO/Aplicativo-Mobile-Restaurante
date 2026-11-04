export function formatarPreco(preco: string | number): string {
  const valor = Number(preco);
  if (Number.isNaN(valor)) return String(preco);
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

export function formatarData(data?: string | null): string {
  if (!data) return '';
  const apenasData = data.slice(0, 10);
  const [ano, mes, dia] = apenasData.split('-');
  if (!ano || !mes || !dia) return data;
  return `${dia}/${mes}/${ano}`;
}

/** Tempo decorrido desde uma data ISO, ex.: "12 min" ou "1h05". */
export function tempoDecorrido(desde?: string | null): string {
  if (!desde) return '';
  const inicio = new Date(desde).getTime();
  if (Number.isNaN(inicio)) return '';
  const minutos = Math.max(0, Math.floor((Date.now() - inicio) / 60000));
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  return `${horas}h${String(minutos % 60).padStart(2, '0')}`;
}

/** Minutos decorridos desde uma data ISO (0 quando não há data válida). */
export function minutosDecorridos(desde?: string | null): number {
  if (!desde) return 0;
  const inicio = new Date(desde).getTime();
  if (Number.isNaN(inicio)) return 0;
  return Math.max(0, Math.floor((Date.now() - inicio) / 60000));
}
