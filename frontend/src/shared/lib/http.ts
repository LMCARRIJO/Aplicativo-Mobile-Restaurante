import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Cliente HTTP compartilhado por todas as features.
 */

const PORTA_API = 8000;

function ehHostLocal(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]' ||
    /^192\.168\./.test(hostname) ||
    /^10\./.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
  );
}

function apiNaPorta(hostname: string, protocol = 'http:'): string {
  return `${protocol}//${hostname}:${PORTA_API}/api`;
}

/**
 * Resolve a base da API.
 * Prioridade: override explícito > host usado pelo Expo Go > host da Web > fallback.
 */
export function resolverApiUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;

    if (/-8081\./.test(hostname)) {
      return `${protocol}//${hostname.replace(/-8081\./, '-8000.')}/api`;
    }

    if (ehHostLocal(hostname)) {
      return apiNaPorta(hostname, protocol);
    }

    return `${protocol}//${hostname}/api`;
  }

  const hostExpo = Constants.expoConfig?.hostUri?.replace(/:\d+$/, '');
  if (hostExpo) {
    const host =
      Platform.OS === 'android' && (hostExpo === 'localhost' || hostExpo === '127.0.0.1')
        ? '10.0.2.2'
        : hostExpo;
    return apiNaPorta(host);
  }

  return apiNaPorta(Platform.OS === 'android' ? '10.0.2.2' : 'localhost');
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
