export interface Produto {
  id: number;
  nome: string;
  preco: string; // decimal:2 vem como string do Laravel
  foto_path: string | null;
  foto_url: string | null;
  descricao?: string | null;
  quantidade_estoque?: number;
  data_validade?: string | null; // Y-m-d
  categoria?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedProdutos {
  data: Produto[];
  links: any;
  meta: any;
}

export interface ProdutoInput {
  nome: string;
  preco: string;
  descricao?: string;
  quantidade_estoque?: string;
  data_validade?: string;
  categoria?: string;
  fotoUri?: string;
}
