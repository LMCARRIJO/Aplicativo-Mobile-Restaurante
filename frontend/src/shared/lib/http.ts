import axios from 'axios';
import { Platform } from 'react-native';

/**
 * Cliente HTTP compartilhado por todas as features.
 */

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

/** URL pública de um arquivo enviado (foto do produto), usando a origem da API. */
export function urlFoto(fotoPath?: string | null): string | null {
  if (!fotoPath) return null;
  const origem = API_URL.replace(/\/api\/?$/, '');
  return `${origem}/storage/${fotoPath.replace(/^\/+/, '')}`;
}

export const api = axios.create({
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
