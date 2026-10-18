import { Modal, StyleSheet, Text, View } from 'react-native';
import { Botao } from './Botao';

interface ModalConfirmacaoProps {
  visible: boolean;
  titulo: string;
  mensagem: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ModalConfirmacao({
  visible,
  titulo,
  mensagem,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  onConfirmar,
  onCancelar,
}: ModalConfirmacaoProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancelar}>
      <View style={styles.overlay}>
        <View style={styles.caixa}>
          <Text style={styles.titulo}>{titulo}</Text>
          <Text style={styles.mensagem}>{mensagem}</Text>
          <View style={styles.acoes}>
            <Botao
              title={textoCancelar}
              variant="secondary"
              onPress={onCancelar}
              containerStyle={styles.acao}
            />
            <Botao
              title={textoConfirmar}
              variant="danger"
              onPress={onConfirmar}
              containerStyle={styles.acao}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  caixa: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  titulo: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 8 },
  mensagem: { fontSize: 14, color: '#444', marginBottom: 20 },
  acoes: { flexDirection: 'row', gap: 8 },
  acao: { flex: 1 },
});
