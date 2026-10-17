import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { Botao } from '@/shared/components/Botao';
import { ProdutoCard } from '../components/ProdutoCard';
import { useProdutos } from '../hooks/useProdutos';
import { API_URL } from '../services/produtosApi';
import { Produto } from '../types/Produto';

export default function ProdutosScreen() {
  const { produtos, loading, refreshing, reload, refresh, remove } = useProdutos();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const confirmarExclusao = (produto: Produto) => {
    Alert.alert('Excluir produto', `Deseja excluir "${produto.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => remove(produto.id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <Botao
        title="Novo produto"
        onPress={() => router.push('/produto/novo')}
        containerStyle={styles.novo}
      />

      {loading ? (
        <ActivityIndicator style={styles.loading} />
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(item) => String(item.id)}
          refreshing={refreshing}
          onRefresh={refresh}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ProdutoCard
              produto={item}
              onEdit={(id) => router.push({ pathname: '/produto/[id]', params: { id: String(id) } })}
              onDelete={() => confirmarExclusao(item)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhum produto. Backend: {API_URL}/produtos</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  novo: { margin: 16 },
  loading: { marginTop: 32 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  empty: { textAlign: 'center', color: '#888', marginTop: 32 },
});
