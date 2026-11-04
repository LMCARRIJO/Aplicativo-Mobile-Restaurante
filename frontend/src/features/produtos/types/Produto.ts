export interface Produto {
  id: number;
  nome: string;
  preco: string; // decimal:2 vem como string do Laravel
  preco_promocional?: string | null;
  foto_path: string | null;
  foto_url: string | null;
  descricao?: string | null;
  ingredientes?: string | null;
  alergenicos?: string | null; // lista separada por vírgula
  porcao?: number | null; // quantas pessoas a porção serve
  disponivel: boolean;
  promocao_fim?: string | null; // Y-m-d
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
  preco_promocional?: string;
  descricao?: string;
  ingredientes?: string;
  alergenicos?: string; // lista separada por vírgula
  porcao?: string;
  disponivel: boolean;
  promocao_fim?: string;
  categoria?: string;
  fotoUri?: string;
  fotoFile?: File; // web: File real retornado pelo expo-image-picker
  fotoName?: string;
  fotoType?: string;
}
