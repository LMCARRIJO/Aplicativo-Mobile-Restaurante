/**
 * Service de API - centraliza chamadas ao backend Laravel
 * Ajuste API_URL para o IP da sua máquina quando testar no device físico
 * Ex: http://192.168.0.10:8000/api
 */
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8000/api';
// Android emulator: 10.0.2.2, iOS simulator: http://localhost:8000/api, device físico: IP local

import { Produto } from '../types/Produto';

export async function listProdutos(): Promise<Produto[]> {
  const res = await fetch(`${API_URL}/produtos`);
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  const json = await res.json();
  // ProdutoResource::collection retorna { data: [...] }
  return json.data ?? json;
}

export async function createProduto(data: { nome: string; descricao?: string; preco: string; quantidade_estoque?: number; data_validade?: string; categoria?: string; fotoUri?: string }): Promise<Produto> {
  const form = new FormData();
  form.append('nome', data.nome);
  if (data.descricao) form.append('descricao', data.descricao);
  form.append('preco', data.preco);
  if (data.quantidade_estoque !== undefined) form.append('quantidade_estoque', String(data.quantidade_estoque));
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
  const res = await fetch(`${API_URL}/produtos`, {
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
