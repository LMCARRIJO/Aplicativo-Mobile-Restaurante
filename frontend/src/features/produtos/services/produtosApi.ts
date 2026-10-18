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
  const res = await fetch(`${API_URL}/produtos/${id}`, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  const json = await res.json();
  return json.data ?? json;
}

function montarFormData(data: ProdutoInput): FormData {
  const form = new FormData();
  form.append('nome', data.nome);
  form.append('preco', data.preco);
  form.append('preco_promocional', data.preco_promocional ?? '');
  form.append('descricao', data.descricao ?? '');
  form.append('ingredientes', data.ingredientes ?? '');
  form.append('alergenicos', data.alergenicos ?? '');
  form.append('porcao', data.porcao ?? '');
  form.append('disponivel', data.disponivel ? '1' : '0');
  form.append('promocao_fim', data.promocao_fim ?? '');
  form.append('categoria', data.categoria ?? '');
  if (data.fotoFile) {
    // Web: o expo-image-picker entrega um File real, que o FormData do navegador aceita.
    form.append('foto', data.fotoFile);
  } else if (data.fotoUri) {
    // Nativo: React Native entende o objeto { uri, name, type }.
    const nomeBruto = data.fotoName ?? data.fotoUri.split('/').pop() ?? 'foto.jpg';
    const nome = /\.[a-z0-9]+$/i.test(nomeBruto) ? nomeBruto : `${nomeBruto}.jpg`;
    form.append('foto', {
      uri: data.fotoUri,
      name: nome,
      type: data.fotoType ?? 'image/jpeg',
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
