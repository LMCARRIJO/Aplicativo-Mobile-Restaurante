export interface Produto {
  id: number;
  nome: string;
  descricao: string | null;
  preco: string; // decimal:2 vem como string do Laravel
  quantidade_estoque: number;
  data_validade: string | null; // Y-m-d
  categoria: string | null;
  foto_path: string | null;
  foto_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedProdutos {
  data: Produto[];
  links: any;
  meta: any;
}
