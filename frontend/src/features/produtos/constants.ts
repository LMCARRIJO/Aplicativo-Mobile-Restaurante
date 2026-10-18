export const CATEGORIAS = [
  'Entrada',
  'Prato Principal',
  'Sobremesa',
  'Bebida',
  'Acompanhamento',
] as const;

export const ALERGENICOS = [
  'Glúten',
  'Lactose',
  'Ovos',
  'Amendoim',
  'Frutos do mar',
  'Soja',
] as const;

export type Categoria = (typeof CATEGORIAS)[number];
export type Alergenico = (typeof ALERGENICOS)[number];
