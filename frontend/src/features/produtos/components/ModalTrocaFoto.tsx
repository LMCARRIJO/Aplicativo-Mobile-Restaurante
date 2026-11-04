import { Modal, StyleSheet, Text, View } from 'react-native';
import { useMemo } from 'react';
import { Botao } from '@/shared/components/Botao';
import { useTheme, type Cores } from '@/shared/theme';

interface ModalTrocaFotoProps {
  visible: boolean;
  onEscolherGaleria: () => void;
  onEscolherCamera: () => void;
  onCancelar: () => void;
}

export function ModalTrocaFoto({
  visible,
  onEscolherGaleria,
  onEscolherCamera,
  onCancelar,
}: ModalTrocaFotoProps) {
  const { cores } = useTheme();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancelar}>
      <View style={estilos.overlay}>
        <View style={estilos.caixa}>
          <Text style={estilos.titulo}>Trocar foto</Text>
          <Text style={estilos.mensagem}>Escolha de onde deseja selecionar a imagem:</Text>
          <View style={estilos.acoes}>
            <Botao
              title="Galeria"
              variant="secondary"
              onPress={onEscolherGaleria}
              containerStyle={estilos.acao}
            />
            <Botao
              title="Câmera"
              onPress={onEscolherCamera}
              containerStyle={estilos.acao}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const criarEstilos = (c: Cores) =>
  StyleSheet.create({
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
      backgroundColor: c.card,
      borderRadius: 12,
      padding: 20,
    },
    titulo: { fontSize: 16, fontWeight: '700', color: c.text, marginBottom: 8 },
    mensagem: { fontSize: 14, color: c.muted, marginBottom: 20 },
    acoes: { flexDirection: 'row', gap: 8 },
    acao: { flex: 1 },
  });
