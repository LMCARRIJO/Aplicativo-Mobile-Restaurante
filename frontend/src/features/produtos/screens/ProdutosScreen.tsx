import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Botao } from '@/shared/components/Botao';
import { ModalConfirmacao } from '@/shared/components/ModalConfirmacao';
import { useTheme, type Cores } from '@/shared/theme';
import { ProdutoCard } from '../components/ProdutoCard';
import { useProdutos } from '../hooks/useProdutos';
import type { Produto } from '../types/Produto';

export default function ProdutosScreen() {
  const { cores } = useTheme();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);
  const { produtos, loading, refreshing, reload, refresh, remove } = useProdutos();
  const [alvo, setAlvo] = useState<Produto | null>(null);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const excluir = () => {
    if (!alvo) return;
    const id = alvo.id;
    setAlvo(null);
    remove(id);
  };

  return (
    <View style={estilos.container}>
      <Botao
        title="Novo produto"
        onPress={() => router.push('/produto/novo')}
        containerStyle={estilos.novo}
      />

      {loading ? (
        <ActivityIndicator style={estilos.loading} color={cores.primary} />
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(item) => String(item.id)}
          refreshing={refreshing}
          onRefresh={refresh}
          contentContainerStyle={estilos.list}
          renderItem={({ item }) => (
            <ProdutoCard
              produto={item}
              onEdit={(id) => router.push({ pathname: '/produto/[id]', params: { id: String(id) } })}
              onDelete={() => setAlvo(item)}
            />
          )}
          ListEmptyComponent={<Text style={estilos.empty}>Nenhum produto cadastrado no cardápio.</Text>}
        />
      )}

      <ModalConfirmacao
        visible={alvo !== null}
        titulo="Excluir produto"
        mensagem={alvo ? `Deseja excluir "${alvo.nome}"?` : ''}
        textoConfirmar="Excluir"
        onConfirmar={excluir}
        onCancelar={() => setAlvo(null)}
      />
    </View>
  );
}

const criarEstilos = (c: Cores) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    novo: { margin: 16 },
    loading: { marginTop: 32 },
    list: { paddingHorizontal: 16, paddingBottom: 40 },
    empty: { textAlign: 'center', color: c.muted, marginTop: 32 },
  });