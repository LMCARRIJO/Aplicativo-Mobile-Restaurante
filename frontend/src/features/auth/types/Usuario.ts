export type Perfil = 'admin' | 'garcom' | 'cozinha';

export interface Usuario {
  id: number;
  name: string;
  email: string;
  role: Perfil;
}

export interface Sessao {
  token: string;
  token_type: string;
  usuario: Usuario;
}
