import { api } from '@/shared/lib/http';
import type { Sessao, Usuario } from '../types/Usuario';

function desembrulhar<T>(data: any): T {
  return (data?.data ?? data) as T;
}

export async function login(email: string, password: string): Promise<Sessao> {
  const { data } = await api.post('/login', { email, password });
  return desembrulhar<Sessao>(data);
}

export async function buscarUsuarioAtual(): Promise<Usuario> {
  const { data } = await api.get('/me');
  return desembrulhar<Usuario>(data);
}

export async function logout(): Promise<void> {
  await api.post('/logout');
}
