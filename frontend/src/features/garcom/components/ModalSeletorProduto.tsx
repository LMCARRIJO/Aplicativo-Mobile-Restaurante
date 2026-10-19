import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Botao } from '@/shared/components/Botao';
import { Campo } from '@/shared/components/Campo';
import { useTheme, type Cores } from '@/shared/theme';
import { formatarPreco } from '@/shared/utils/format';
import { useProdutos } from '@/features/produtos/hooks/useProdutos';
import type { Produto } from '@/features/produtos/types/Produto';

interface ModalSeletorProdutoProps {
  visible: boolean;
  onFechar: () => void;
  onSelecionar: (produto: Produto) => void;
}

/** Lista o cardápio para o garçom escolher o prato que entra na comanda. */
export function ModalSeletorProduto({ visible, onFechar, onSelecionar }: ModalSeletorProdutoProps) {
  const { cores } = useTheme();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);
  const { produtos, loading } = useProdutos();
  const [busca, setBusca] = useState('');

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return produtos;
    return produtos.filter(
      (p) =>
        p.nome.toLowerCase().includes(termo) || (p.categoria ?? '').toLowerCase().includes(termo),
    );
  }, [produtos, busca]);

  const fechar = () => {
    setBusca('');
    onFechar();
  };

  const selecionar = (produto: Produto) => {
    setBusca('');
    onSelecionar(produto);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={fechar}>
      <View style={estilos.overlay}>
        <View style={estilos.caixa}>
          <Text style={estilos.titulo}>Adicionar item</Text>
          <Campo
            label="Buscar no cardápio"
            value={busca}
            onChangeText={setBusca}
            placeholder="Nome ou categoria do prato"
            autoCorrect={false}
          />

          {loading ? (
            <ActivityIndicator color={cores.primary} style={estilos.loading} />
          ) : (
            <FlatList
              data={filtrados}
              keyExtractor={(item) => String(item.id)}
              style={estilos.lista}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={<Text style={estilos.vazio}>Nenhum prato encontrado.</Text>}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => selecionar(item)}
                  style={({ pressed }) => [estilos.item, pressed && estilos.pressionado]}
                >
                  <View style={estilos.itemTexto}>
                    <Text style={estilos.itemNome}>{item.nome}</Text>
                    <Text style={estilos.itemMeta}>
                      {item.categoria ?? 'Sem categoria'}
                      {item.disponivel ? '' : ' • esgotado'}
                    </Text>
                  </View>
                  <Text style={item.disponivel ? estilos.preco : estilos.precoEsgotado}>
                    {formatarPreco(item.preco_promocional || item.preco)}
                  </Text>
                </Pressable>
              )}
            />
          )}

          <Botao title="Cancelar" variant="secondary" onPress={fechar} containerStyle={estilos.cancelar} />
        </View>
      </View>
    </Modal>
  );
}

const criarEstilos = (c: Cores) =>
  StyleSheet.create({
    overlay: { flex: 1, backgroundColor: c.overlay, justifyContent: 'flex-end' },
    caixa: {
      backgroundColor: c.background,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      borderTopWidth: 1,
      borderColor: c.border,
      padding: 16,
      maxHeight: '88%',
    },
    titulo: { fontSize: 17, fontWeight: '700', color: c.text, marginBottom: 12 },
    loading: { marginVertical: 24 },
    lista: { marginBottom: 12 },
    vazio: { textAlign: 'center', color: c.muted, marginVertical: 24 },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
    },
    pressionado: { opacity: 0.75 },
    itemTexto: { flex: 1 },
    itemNome: { fontSize: 15, fontWeight: '700', color: c.text },
    itemMeta: { fontSize: 12, color: c.muted, marginTop: 2 },
    preco: { fontSize: 15, fontWeight: '700', color: c.text },
    precoEsgotado: { fontSize: 15, fontWeight: '700', color: c.muted, textDecorationLine: 'line-through' },
    cancelar: { marginTop: 4 },
  });
