export interface Produto {
  id: number;
  nome: string;
  preco: string; // decimal:2 vem como string do Laravel
  foto_path: string | null;
  foto_url: string | null;
  // Oi, quando você liberar os novos campos no backend, pode descomentar aqui também
  // descricao?: string | null;
  // quantidade_estoque?: number;
  // data_validade?: string | null; // Y-m-d
  // categoria?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedProdutos {
  data: Produto[];
  links: any;
  meta: any;
}
