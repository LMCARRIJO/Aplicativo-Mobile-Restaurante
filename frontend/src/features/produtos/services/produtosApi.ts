import { api } from '@/shared/lib/http';
import { PaginatedProdutos, Produto, ProdutoInput } from '../types/Produto';

// O cliente HTTP e os helpers de URL/erro são compartilhados (src/shared/lib/http.ts).
export { API_URL, mensagemErro, resolverApiUrl, urlFoto } from '@/shared/lib/http';

function montarFormData(input: ProdutoInput, comFoto: boolean): FormData {
  const form = new FormData();
  const add = (k: string, v?: string | null) => {
    if (v !== undefined && v !== null) form.append(k, v);
  };

  add('nome', input.nome);
  add('preco', input.preco);
  add('preco_promocional', input.preco_promocional ?? '');
  add('descricao', input.descricao ?? '');
  add('ingredientes', input.ingredientes ?? '');
  add('alergenicos', input.alergenicos ?? '');
  add('porcao', input.porcao ?? '');
  add('categoria', input.categoria ?? '');
  add('promocao_fim', input.promocao_fim ?? '');
  form.append('disponivel', input.disponivel ? '1' : '0');

  if (comFoto) {
    if (input.fotoFile) {
      form.append('foto', input.fotoFile); // web: File real do expo-image-picker
    } else if (input.fotoUri) {
      const nome = input.fotoName ?? input.fotoUri.split('/').pop() ?? 'foto.jpg';
      const ext = nome.split('.').pop() ?? 'jpg';
      form.append('foto', {
        uri: input.fotoUri,
        name: nome,
        type: input.fotoType ?? `image/${ext}`,
      } as any);
    }
  }
  return form;
}

export async function listProdutos(): Promise<Produto[]> {
  const todos: Produto[] = [];
  let page = 1;
  let lastPage = 1;
  do {
    const { data } = await api.get<PaginatedProdutos | Produto[]>('/produtos', {
      params: { page, per_page: 100 },
    });
    const itens = Array.isArray(data) ? data : data.data ?? [];
    todos.push(...itens);
    lastPage = Array.isArray(data) ? 1 : data.meta?.last_page ?? 1;
    page += 1;
  } while (page <= lastPage);
  return todos;
}

export async function getProduto(id: number): Promise<Produto> {
  const { data } = await api.get(`/produtos/${id}`);
  return (data as any).data ?? data;
}

export async function createProduto(input: ProdutoInput): Promise<Produto> {
  const { data } = await api.post('/produtos', montarFormData(input, true));
  return (data as any).data ?? data;
}

export async function updateProduto(id: number, input: ProdutoInput): Promise<Produto> {
  const comFoto = Boolean(input.fotoUri || input.fotoFile);
  const form = montarFormData(input, comFoto);
  form.append('_method', 'PUT'); // method spoofing no multipart
  const { data } = await api.post(`/produtos/${id}`, form);
  return (data as any).data ?? data;
}

export async function deleteProduto(id: number): Promise<void> {
  await api.delete(`/produtos/${id}`);
}
