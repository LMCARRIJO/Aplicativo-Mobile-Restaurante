import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { ProdutoForm } from '../components/ProdutoForm';
import { createProduto, getProduto, updateProduto } from '../services/produtosApi';
import { Produto, ProdutoInput } from '../types/Produto';

export default function ProdutoFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editando = Boolean(id);

  const [produto, setProduto] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(editando);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setProduto(await getProduto(Number(id)));
      } catch (e: any) {
        Alert.alert('Erro', e.message);
      } finally {
        setCarregando(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (data: ProdutoInput) => {
    try {
      setSalvando(true);
      if (editando && id) {
        await updateProduto(Number(id), data);
      } else {
        await createProduto(data);
      }
      Alert.alert(
        'Sucesso',
        editando ? 'Produto atualizado.' : 'Produto criado.',
        [{ text: 'OK', onPress: () => router.back() }],
      );
    } catch (e: any) {
      Alert.alert('Erro ao salvar', e.message);
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProdutoForm
        initial={
          produto
            ? {
                nome: produto.nome,
                preco: produto.preco,
                descricao: produto.descricao ?? '',
                quantidade_estoque:
                  produto.quantidade_estoque != null ? String(produto.quantidade_estoque) : '',
                data_validade: produto.data_validade ?? '',
                categoria: produto.categoria ?? '',
              }
            : undefined
        }
        fotoAtualUrl={produto?.foto_url ?? null}
        submitting={salvando}
        submitLabel={editando ? 'Salvar alterações' : 'Criar produto'}
        onSubmit={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
