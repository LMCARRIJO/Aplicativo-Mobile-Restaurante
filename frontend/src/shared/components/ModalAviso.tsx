import { Modal, StyleSheet, Text, View } from 'react-native';
import { Botao } from './Botao';

interface ModalAvisoProps {
  visible: boolean;
  titulo: string;
  mensagem?: string;
  textoOk?: string;
  onFechar: () => void;
}

export function ModalAviso({
  visible,
  titulo,
  mensagem,
  textoOk = 'OK',
  onFechar,
}: ModalAvisoProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onFechar}>
      <View style={styles.overlay}>
        <View style={styles.caixa}>
          <Text style={styles.titulo}>{titulo}</Text>
          {mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}
          <Botao title={textoOk} onPress={onFechar} />
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
});
