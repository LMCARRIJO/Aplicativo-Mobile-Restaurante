/**
 * Service de API da feature de produtos - centraliza chamadas ao backend Laravel.
 * Ajuste API_URL para o IP da sua máquina quando testar no device físico.
 * Ex: http://192.168.0.10:8000/api
 */
import { PaginatedProdutos, Produto, ProdutoInput } from '../types/Produto';

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8000/api';
// Android emulator: 10.0.2.2, iOS simulator: http://localhost:8000/api, device físico: IP local

/**
 * Monta a URL pública da foto a partir do caminho salvo no backend.
 * Usa a origem da API, então funciona no Codespace, emulador e device físico.
 */
export function urlFoto(fotoPath?: string | null): string | null {
  if (!fotoPath) return null;
  const origem = API_URL.replace(/\/api\/?$/, '');
  return `${origem}/storage/${fotoPath.replace(/^\/+/, '')}`;
}

export async function listProdutos(): Promise<Produto[]> {
  const todos: Produto[] = [];
  let page = 1;
  let lastPage = 1;

  do {
    const res = await fetch(`${API_URL}/produtos?page=${page}&per_page=100`);
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    const json: PaginatedProdutos | Produto[] = await res.json();
    const itens = Array.isArray(json) ? json : json.data ?? [];
    todos.push(...itens);
    lastPage = Array.isArray(json) ? 1 : json.meta?.last_page ?? 1;
    page += 1;
  } while (page <= lastPage);

  return todos;
}

export async function getProduto(id: number): Promise<Produto> {
  const res = await fetch(`${API_URL}/produtos/${id}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  const json = await res.json();
  return json.data ?? json;
}

export async function createProduto(input: ProdutoInput): Promise<Produto> {
  const form = new FormData();
  form.append('nome', input.nome);
  form.append('preco', input.preco);
  if (input.descricao) form.append('descricao', input.descricao);
  if (input.quantidade_estoque) form.append('quantidade_estoque', input.quantidade_estoque);
  if (input.data_validade) form.append('data_validade', input.data_validade);
  if (input.categoria) form.append('categoria', input.categoria);
  if (input.fotoUri) {
    const nome = input.fotoUri.split('/').pop() ?? 'foto.jpg';
    const ext = nome.split('.').pop() ?? 'jpg';
    form.append('foto', { uri: input.fotoUri, name: nome, type: `image/${ext}` } as any);
  }

  const res = await fetch(`${API_URL}/produtos`, { method: 'POST', body: form });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  const json = await res.json();
  return json.data ?? json;
}

export async function updateProduto(id: number, input: ProdutoInput): Promise<Produto> {
  const form = new FormData();
  form.append('_method', 'PUT');
  form.append('nome', input.nome);
  form.append('preco', input.preco);
  if (input.descricao) form.append('descricao', input.descricao);
  if (input.quantidade_estoque) form.append('quantidade_estoque', input.quantidade_estoque);
  if (input.data_validade) form.append('data_validade', input.data_validade);
  if (input.categoria) form.append('categoria', input.categoria);
  if (input.fotoUri) {
    const nome = input.fotoUri.split('/').pop() ?? 'foto.jpg';
    const ext = nome.split('.').pop() ?? 'jpg';
    form.append('foto', { uri: input.fotoUri, name: nome, type: `image/${ext}` } as any);
  }

  const res = await fetch(`${API_URL}/produtos/${id}`, { method: 'POST', body: form });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  const json = await res.json();
  return json.data ?? json;
}

export async function deleteProduto(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/produtos/${id}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
}
