import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { deleteProduto, listProdutos } from '../services/produtosApi';
import { Produto } from '../types/Produto';

export function useProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setProdutos(await listProdutos());
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      setProdutos(await listProdutos());
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const remove = useCallback(async (id: number) => {
    try {
      await deleteProduto(id);
      setProdutos((prev) => prev.filter((produto) => produto.id !== id));
    } catch (e: any) {
      Alert.alert('Erro ao excluir', e.message);
    }
  }, []);

  return { produtos, loading, refreshing, reload: load, refresh, remove };
}
