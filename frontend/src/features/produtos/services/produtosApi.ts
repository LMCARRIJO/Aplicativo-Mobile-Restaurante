import axios from 'axios';
import { PaginatedProdutos, Produto, ProdutoInput } from '../types/Produto';

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { Accept: 'application/json' },
  timeout: 15000,
});

const MULTIPART = { headers: { 'Content-Type': 'multipart/form-data' } };

export async function listProdutos(): Promise<Produto[]> {
  const todos: Produto[] = [];
  let page = 1;
  let lastPage = 1;

  do {
    const { data } = await api.get<PaginatedProdutos>('/produtos', {
      params: { page, per_page: 100 },
    });
    todos.push(...(data.data ?? []));
    lastPage = data.meta?.last_page ?? 1;
    page += 1;
  } while (page <= lastPage);

  return todos;
}

export async function getProduto(id: number): Promise<Produto> {
  const { data } = await api.get(`/produtos/${id}`);
  return (data as any).data ?? data;
}

function montarFormData(dados: ProdutoInput): FormData {
  const form = new FormData();
  form.append('nome', dados.nome);
  form.append('preco', dados.preco.replace(',', '.'));
  if (dados.descricao) form.append('descricao', dados.descricao);
  if (dados.quantidade_estoque) form.append('quantidade_estoque', dados.quantidade_estoque);
  if (dados.data_validade) form.append('data_validade', dados.data_validade);
  if (dados.categoria) form.append('categoria', dados.categoria);
  if (dados.fotoUri) {
    const nome = dados.fotoUri.split('/').pop() ?? 'foto.jpg';
    const ext = nome.split('.').pop() ?? 'jpg';
    form.append('foto', { uri: dados.fotoUri, name: nome, type: `image/${ext}` } as any);
  }
  return form;
}

export async function createProduto(dados: ProdutoInput): Promise<Produto> {
  const { data } = await api.post('/produtos', montarFormData(dados), MULTIPART);
  return (data as any).data ?? data;
}

export async function updateProduto(id: number, dados: ProdutoInput): Promise<Produto> {
  const form = montarFormData(dados);
  form.append('_method', 'PUT');
  const { data } = await api.post(`/produtos/${id}`, form, MULTIPART);
  return (data as any).data ?? data;
}

export async function deleteProduto(id: number): Promise<void> {
  await api.delete(`/produtos/${id}`);
}

export function mensagemErro(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as any;
    if (data?.errors) return Object.values(data.errors).flat().join('\n');
    if (data?.message) return data.message;
    return error.message;
  }
  return error instanceof Error ? error.message : 'Erro inesperado';
}