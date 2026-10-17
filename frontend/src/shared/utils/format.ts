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
