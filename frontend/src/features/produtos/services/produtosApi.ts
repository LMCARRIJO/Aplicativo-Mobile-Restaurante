/**
 * Service de API da feature de produtos - centraliza chamadas ao backend Laravel.
 * Ajuste API_URL para o IP da sua máquina quando testar no device físico.
 * Ex: http://192.168.0.10:8000/api
 */
import { PaginatedProdutos, Produto, ProdutoInput } from '../types/Produto';

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8000/api';
// Android emulator: 10.0.2.2, iOS simulator: http://localhost:8000/api, device físico: IP local

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
  const res = await fetch(`${API_URL}/produtos/${id}`, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  const json = await res.json();
  return json.data ?? json;
}

function montarFormData(data: ProdutoInput): FormData {
  const form = new FormData();
  form.append('nome', data.nome);
  form.append('preco', data.preco);
  if (data.descricao) form.append('descricao', data.descricao);
  if (data.quantidade_estoque) form.append('quantidade_estoque', data.quantidade_estoque);
  if (data.data_validade) form.append('data_validade', data.data_validade);
  if (data.categoria) form.append('categoria', data.categoria);
  if (data.fotoUri) {
    const filename = data.fotoUri.split('/').pop() ?? 'foto.jpg';
    const ext = filename.split('.').pop() ?? 'jpg';
    form.append('foto', {
      uri: data.fotoUri,
      name: filename,
      type: `image/${ext}`,
    } as any);
  }
  return form;
}

export async function createProduto(data: ProdutoInput): Promise<Produto> {
  const res = await fetch(`${API_URL}/produtos`, {
    method: 'POST',
    body: montarFormData(data),
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(JSON.stringify(err));
  }
  const json = await res.json();
  return json.data ?? json;
}

export async function updateProduto(id: number, data: ProdutoInput): Promise<Produto> {
  // Multipart + method spoofing: o Laravel lê `_method=PUT` e aceita o upload da foto.
  const form = montarFormData(data);
  form.append('_method', 'PUT');

  const res = await fetch(`${API_URL}/produtos/${id}`, {
    method: 'POST',
    body: form,
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(JSON.stringify(err));
  }
  const json = await res.json();
  return json.data ?? json;
}

export async function deleteProduto(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/produtos/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error(`Erro ${res.status}`);
}
