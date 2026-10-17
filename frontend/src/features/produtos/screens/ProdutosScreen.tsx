import { router } from 'expo-router';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { Botao } from '@/shared/components/Botao';
import { colors, spacing } from '@/shared/theme';
import { ProdutoCard } from '../components/ProdutoCard';
import { useDeleteProduto, useProdutos } from '../hooks/useProdutos';
import { mensagemErro } from '../services/produtosApi';
import { Produto } from '../types/Produto';

export default function ProdutosScreen() {
  const { data: produtos = [], isLoading, isRefetching, refetch, error } = useProdutos();
  const { mutate: remover } = useDeleteProduto();

  const confirmarExclusao = (produto: Produto) => {
    Alert.alert('Excluir produto', `Deseja excluir "${produto.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () =>
          remover(produto.id, {
            onError: (e) => Alert.alert('Erro ao excluir', mensagemErro(e)),
          }),
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{mensagemErro(error)}</Text>
        <Botao title="Tentar novamente" onPress={() => refetch()} containerStyle={styles.retry} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Botao
        title="+ Novo produto"
        onPress={() => router.push('/produto/novo')}
        containerStyle={styles.novo}
      />

      <FlatList
        data={produtos}
        keyExtractor={(item) => String(item.id)}
        refreshing={isRefetching}
        onRefresh={refetch}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ProdutoCard
            produto={item}
            onEdit={(id) => router.push({ pathname: '/produto/[id]', params: { id: String(id) } })}
            onDelete={() => confirmarExclusao(item)}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum produto cadastrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  novo: { margin: spacing.lg },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl * 2 },
  empty: { textAlign: 'center', color: colors.muted, marginTop: spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  errorText: { color: colors.danger, textAlign: 'center', marginBottom: spacing.md },
  retry: { alignSelf: 'stretch' },
});