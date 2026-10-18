import axios from 'axios';
import { Platform } from 'react-native';
import { PaginatedProdutos, Produto, ProdutoInput } from '../types/Produto';

/**
 * Resolve a base da API. No Codespaces (web) troca a porta 8081 do Expo pela 8000 do Laravel.
 */
export function resolverApiUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    const host = hostname.replace(/-8081\./, '-8000.');
    return `${protocol}//${host}/api`;
  }
  return 'http://10.0.2.2:8000/api';
}

export const API_URL = resolverApiUrl();

/** URL pública da foto (usa a origem da API; funciona no Codespace, emulador e device). */
export function urlFoto(fotoPath?: string | null): string | null {
  if (!fotoPath) return null;
  const origem = API_URL.replace(/\/api\/?$/, '');
  return `${origem}/storage/${fotoPath.replace(/^\/+/, '')}`;
}

const api = axios.create({
  baseURL: API_URL,
  headers: { Accept: 'application/json' },
  timeout: 20000,
});

/** Extrai a melhor mensagem possível de um erro axios (inclui erros de validação do Laravel). */
export function mensagemErro(erro: unknown): string {
  if (axios.isAxiosError(erro)) {
    const data = erro.response?.data as any;
    if (data?.errors) {
      const primeira = Object.values(data.errors)[0];
      if (Array.isArray(primeira) && primeira[0]) return String(primeira[0]);
    }
    if (data?.message) return String(data.message);
    return erro.message;
  }
  if (erro instanceof Error) return erro.message;
  return 'Erro inesperado.';
}

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