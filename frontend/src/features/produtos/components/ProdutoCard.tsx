import { Image, StyleSheet, Text, View } from 'react-native';
import { Botao } from '@/shared/components/Botao';
import { formatarData, formatarPreco } from '@/shared/utils/format';
import { urlFoto } from '../services/produtosApi';
import { Produto } from '../types/Produto';

interface ProdutoCardProps {
  produto: Produto;
  onEdit: (id: number) => void;
  onDelete: () => void;
}

export function ProdutoCard({ produto, onEdit, onDelete }: ProdutoCardProps) {
  const temPromocao = produto.preco_promocional != null && produto.preco_promocional !== '';
  const foto = urlFoto(produto.foto_path);

  return (
    <View style={styles.card}>
      <View style={styles.topo}>
        <Text style={styles.title}>{produto.nome}</Text>
        <View
          style={[
            styles.badge,
            produto.disponivel ? styles.badgeDisponivel : styles.badgeEsgotado,
          ]}
        >
          <Text style={styles.badgeTexto}>
            {produto.disponivel ? 'Disponível' : 'Esgotado'}
          </Text>
        </View>
      </View>

      <View style={styles.precos}>
        {temPromocao ? (
          <>
            <Text style={styles.precoPromocional}>
              {formatarPreco(produto.preco_promocional as string)}
            </Text>
            <Text style={styles.precoOriginal}>{formatarPreco(produto.preco)}</Text>
          </>
        ) : (
          <Text style={styles.preco}>{formatarPreco(produto.preco)}</Text>
        )}
      </View>

      {foto ? <Image source={{ uri: foto }} style={styles.image} /> : null}
      {produto.descricao ? <Text style={styles.meta}>{produto.descricao}</Text> : null}
      <Text style={styles.meta}>
        {produto.categoria ? `Categoria: ${produto.categoria}` : ''}
        {produto.porcao ? `${produto.categoria ? ' • ' : ''}Serve ${produto.porcao}` : ''}
      </Text>
      {produto.ingredientes ? (
        <Text style={styles.meta}>Ingredientes: {produto.ingredientes}</Text>
      ) : null}
      {produto.alergenicos ? (
        <Text style={styles.meta}>Alergênicos: {produto.alergenicos}</Text>
      ) : null}
      {produto.promocao_fim ? (
        <Text style={styles.promocao}>Promoção até {formatarData(produto.promocao_fim)}</Text>
      ) : null}
      <Text style={styles.meta}>
        ID {produto.id} • {formatarData(produto.created_at)}
      </Text>
      <View style={styles.actions}>
        <Botao title="Editar" onPress={() => onEdit(produto.id)} containerStyle={styles.action} />
        <Botao
          title="Excluir"
          variant="danger"
          onPress={onDelete}
          containerStyle={styles.action}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: '#eee', padding: 12, borderRadius: 8, marginBottom: 8 },
  topo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  title: { fontWeight: '600', flex: 1 },
  badge: { borderRadius: 12, paddingVertical: 2, paddingHorizontal: 8 },
  badgeDisponivel: { backgroundColor: '#dcfce7' },
  badgeEsgotado: { backgroundColor: '#fee2e2' },
  badgeTexto: { fontSize: 10, fontWeight: '600', color: '#333' },
  precos: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 4 },
  preco: { fontSize: 15, fontWeight: '700', color: '#111' },
  precoPromocional: { fontSize: 15, fontWeight: '700', color: '#c00' },
  precoOriginal: { fontSize: 12, color: '#888', textDecorationLine: 'line-through' },
  image: { width: '100%', height: 140, borderRadius: 6, marginVertical: 8, backgroundColor: '#f0f0f0' },
  meta: { fontSize: 11, color: '#888', marginBottom: 8 },
  promocao: { fontSize: 11, color: '#c00', fontWeight: '600', marginBottom: 8 },
  actions: { flexDirection: 'row', gap: 8 },
  action: { flex: 1 },
});
