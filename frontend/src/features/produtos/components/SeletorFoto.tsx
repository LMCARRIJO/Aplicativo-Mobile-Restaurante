import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme, type Cores } from '@/shared/theme';

interface SeletorFotoProps {
  uri?: string | null;
  onPress: () => void;
}

export function SeletorFoto({ uri, onPress }: SeletorFotoProps) {
  const { cores } = useTheme();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);

  return (
    <View style={estilos.bloco}>
      <Text style={estilos.rotulo}>Foto</Text>
      <Pressable onPress={onPress} style={[estilos.caixa, !uri && estilos.caixaVazia]}>
        {uri ? (
          <>
            <Image source={{ uri }} style={estilos.imagem} resizeMode="cover" />
            <View style={estilos.overlay}>
              <Text style={estilos.overlayTexto}>Trocar foto</Text>
            </View>
          </>
        ) : (
          <>
            <Text style={estilos.mais}>+</Text>
            <Text style={estilos.vazioTexto}>Adicionar foto</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

const criarEstilos = (c: Cores) =>
  StyleSheet.create({
    bloco: { marginBottom: 16 },
    rotulo: { fontSize: 12, color: c.muted, marginBottom: 6, fontWeight: '600' },
    caixa: {
      width: 156,
      height: 156,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: c.fotoFundo,
      alignItems: 'center',
      justifyContent: 'center',
    },
    caixaVazia: { borderWidth: 2, borderStyle: 'dashed', borderColor: c.chipBorder },
    imagem: { width: '100%', height: '100%' },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: c.overlay,
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingBottom: 8,
    },
    overlayTexto: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
    mais: { fontSize: 32, color: c.muted, fontWeight: '300' },
    vazioTexto: { fontSize: 12, color: c.muted, marginTop: 4 },
  });