import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  lerToken,
  registrarExpiracaoSessao,
  removerToken,
  salvarToken,
} from '@/shared/lib/sessao';
import { buscarUsuarioAtual, login, logout } from '../services/authApi';
import type { Usuario } from '../types/Usuario';

interface AuthContextValue {
  usuario: Usuario | null;
  carregando: boolean;
  entrar: (email: string, password: string) => Promise<Usuario>;
  sair: () => Promise<void>;
  ehAdmin: boolean;
  ehGarcom: boolean;
  ehCozinha: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function restaurarSessao() {
      try {
        const token = await lerToken();
        if (!token) return;

        const usuarioAtual = await buscarUsuarioAtual();
        if (ativo) {
          setUsuario(usuarioAtual);
        }
      } catch {
        await removerToken();
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void restaurarSessao();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    registrarExpiracaoSessao(() => setUsuario(null));
    return () => registrarExpiracaoSessao(null);
  }, []);

  const entrar = useCallback(async (email: string, password: string) => {
    const sessao = await login(email, password);
    await salvarToken(sessao.token);
    setUsuario(sessao.usuario);
    return sessao.usuario;
  }, []);

  const sair = useCallback(async () => {
    try {
      await logout();
    } catch {
      // O token pode já ter expirado; a sessão local deve ser encerrada de qualquer forma.
    } finally {
      await removerToken();
      setUsuario(null);
    }
  }, []);

  const valor = useMemo<AuthContextValue>(
    () => ({
      usuario,
      carregando,
      entrar,
      sair,
      ehAdmin: usuario?.role === 'admin',
      ehGarcom: usuario?.role === 'garcom',
      ehCozinha: usuario?.role === 'cozinha',
    }),
    [usuario, carregando, entrar, sair],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return contexto;
}
