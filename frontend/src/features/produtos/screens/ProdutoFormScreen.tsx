import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/shared/theme';
import { ProdutoForm } from '../components/ProdutoForm';
import { useCreateProduto, useProduto, useUpdateProduto } from '../hooks/useProdutos';
import { mensagemErro } from '../services/produtosApi';
import { ProdutoInput } from '../types/Produto';
import { ProdutoFormData } from '../schemas/produtoSchema';

export default function ProdutoFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const produtoId = id ? Number(id) : undefined;
  const editando = Boolean(produtoId);

  const { data: produto, isLoading } = useProduto(produtoId);
  const criar = useCreateProduto();
  const atualizar = useUpdateProduto();
  const salvando = criar.isPending || atualizar.isPending;

  const handleSubmit = async (dados: ProdutoFormData, fotoUri?: string) => {
    const payload: ProdutoInput = { ...dados, fotoUri };
    try {
      if (editando && produtoId) {
        await atualizar.mutateAsync({ id: produtoId, dados: payload });
      } else {
        await criar.mutateAsync(payload);
      }
      Alert.alert('Sucesso', editando ? 'Produto atualizado.' : 'Produto criado.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert('Erro ao salvar', mensagemErro(e));
    }
  };

  if (editando && isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProdutoForm
        key={produtoId ?? 'novo'}
        defaultValues={
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
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});