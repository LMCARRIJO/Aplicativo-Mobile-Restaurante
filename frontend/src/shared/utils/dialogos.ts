import { Alert, Platform } from 'react-native';

/**
 * Avisos informativos cross-platform.
 * O `AvisoProvider` (montado no layout raiz) registra um handler que abre o
 * `ModalAviso` dentro do app. Assim não usamos `window.alert` no web nem
 * dependemos do `Alert` do react-native-web (que é um no-op).
 */

type AvisoHandler = (titulo: string, mensagem?: string) => Promise<void>;

let handler: AvisoHandler | null = null;

export function registrarAviso(novoHandler: AvisoHandler | null) {
  handler = novoHandler;
}

export function alerta(titulo: string, mensagem?: string): Promise<void> {
  if (handler) return handler(titulo, mensagem);

  // Fallback caso o provider ainda não esteja montado (nativo).
  if (Platform.OS === 'web') return Promise.resolve();

  return new Promise((resolve) => {
    Alert.alert(titulo, mensagem, [{ text: 'OK', onPress: () => resolve() }], {
      cancelable: true,
      onDismiss: () => resolve(),
    });
  });
}
