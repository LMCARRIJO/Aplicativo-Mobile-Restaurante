import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { alerta } from '@/shared/utils/dialogos';
import { ProdutoForm } from '../components/ProdutoForm';
import { createProduto, getProduto, updateProduto, urlFoto } from '../services/produtosApi';
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
        alerta('Erro', e.message);
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
      await alerta('Sucesso', editando ? 'Produto atualizado.' : 'Produto criado.');
      router.back();
    } catch (e: any) {
      alerta('Erro ao salvar', e.message);
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
