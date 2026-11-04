import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme, type Cores } from '@/shared/theme';
import { alerta } from '@/shared/utils/dialogos';
import { ProdutoForm } from '../components/ProdutoForm';
import { useProduto, useSalvarProduto } from '../hooks/useProdutos';
import { mensagemErro, urlFoto } from '../services/produtosApi';
import type { ProdutoInput } from '../types/Produto';

export default function ProdutoFormScreen() {
  const { cores } = useTheme();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);

  const { id } = useLocalSearchParams<{ id?: string }>();
  const numeroId = id ? Number(id) : undefined;
  const editando = numeroId != null;

  const produtoQuery = useProduto(numeroId);
  const { mutateAsync, isPending } = useSalvarProduto();

  const handleSubmit = async (data: ProdutoInput) => {
    try {
      await mutateAsync({ id: numeroId, input: data });
      await alerta('Sucesso', editando ? 'Produto atualizado.' : 'Produto criado.');
      router.back();
    } catch (e) {
      await alerta('Erro ao salvar', mensagemErro(e));
    }
  };

  if (editando && produtoQuery.isLoading) {
    return (
      <View style={estilos.center}>
        <ActivityIndicator color={cores.primary} />
      </View>
    );
  }

  const produto = produtoQuery.data;

  return (
    <View style={estilos.container}>
      <ProdutoForm
        initial={
          produto
            ? {
                nome: produto.nome,
                preco: produto.preco,
                preco_promocional: produto.preco_promocional ?? '',
                descricao: produto.descricao ?? '',
                ingredientes: produto.ingredientes ?? '',
                alergenicos: produto.alergenicos ?? '',
                porcao: produto.porcao != null ? String(produto.porcao) : '',
                disponivel: produto.disponivel,
                promocao_fim: produto.promocao_fim ?? '',
                categoria: produto.categoria ?? '',
              }
            : undefined
        }
        fotoAtualUrl={urlFoto(produto?.foto_path ?? null)}
        submitting={isPending}
        submitLabel={editando ? 'Salvar alterações' : 'Criar produto'}
        onSubmit={handleSubmit}
      />
    </View>
  );
}

const criarEstilos = (c: Cores) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: c.background },
  });