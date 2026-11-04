import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const CHAVE_TOKEN = 'restaurante.auth.token';

let tokenEmMemoria: string | null = null;
let aoExpirarSessao: (() => void) | null = null;

function armazenamentoWebDisponivel(): boolean {
  return typeof localStorage !== 'undefined';
}

export async function salvarToken(token: string): Promise<void> {
  tokenEmMemoria = token;

  if (Platform.OS === 'web') {
    if (armazenamentoWebDisponivel()) {
      localStorage.setItem(CHAVE_TOKEN, token);
    }
    return;
  }

  await SecureStore.setItemAsync(CHAVE_TOKEN, token);
}

export async function lerToken(): Promise<string | null> {
  if (tokenEmMemoria) {
    return tokenEmMemoria;
  }

  const token =
    Platform.OS === 'web'
      ? armazenamentoWebDisponivel()
        ? localStorage.getItem(CHAVE_TOKEN)
        : null
      : await SecureStore.getItemAsync(CHAVE_TOKEN);

  tokenEmMemoria = token;
  return token;
}

export async function removerToken(): Promise<void> {
  tokenEmMemoria = null;

  if (Platform.OS === 'web') {
    if (armazenamentoWebDisponivel()) {
      localStorage.removeItem(CHAVE_TOKEN);
    }
    return;
  }

  await SecureStore.deleteItemAsync(CHAVE_TOKEN);
}

export function registrarExpiracaoSessao(callback: (() => void) | null): void {
  aoExpirarSessao = callback;
}

export function notificarSessaoExpirada(): void {
  tokenEmMemoria = null;
  void removerToken();
  aoExpirarSessao?.();
}
