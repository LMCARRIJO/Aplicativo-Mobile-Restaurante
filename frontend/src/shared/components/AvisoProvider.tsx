import { useEffect, useRef, useState, type ReactNode } from 'react';
import { registrarAviso } from '@/shared/utils/dialogos';
import { ModalAviso } from './ModalAviso';

interface Aviso {
  titulo: string;
  mensagem?: string;
}

export function AvisoProvider({ children }: { children: ReactNode }) {
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const resolver = useRef<(() => void) | null>(null);

  useEffect(() => {
    registrarAviso((titulo, mensagem) => {
      resolver.current?.();
      return new Promise<void>((resolve) => {
        resolver.current = resolve;
        setAviso({ titulo, mensagem });
      });
    });

    return () => registrarAviso(null);
  }, []);

  const fechar = () => {
    setAviso(null);
    const resolve = resolver.current;
    resolver.current = null;
    resolve?.();
  };

  return (
    <>
      {children}
      <ModalAviso
        visible={aviso !== null}
        titulo={aviso?.titulo ?? ''}
        mensagem={aviso?.mensagem}
        onFechar={fechar}
      />
    </>
  );
}
