import { Image, StyleSheet, Text, View } from 'react-native';
import { Botao } from '@/shared/components/Botao';
import { formatarData, formatarPreco } from '@/shared/utils/format';
import { Produto } from '../types/Produto';

interface ProdutoCardProps {
  produto: Produto;
  onEdit: (id: number) => void;
  onDelete: () => void;
}

export function ProdutoCard({ produto, onEdit, onDelete }: ProdutoCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {produto.nome} - {formatarPreco(produto.preco)}
      </Text>
      {produto.descricao ? <Text style={styles.meta}>{produto.descricao}</Text> : null}
      {produto.foto_url ? <Image source={{ uri: produto.foto_url }} style={styles.image} /> : null}
      <Text style={styles.meta}>
        {produto.categoria ? `Categoria: ${produto.categoria} • ` : ''}
        Estoque: {produto.quantidade_estoque ?? 0}
        {produto.data_validade ? ` • Validade: ${formatarData(produto.data_validade)}` : ''}
      </Text>
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
  title: { fontWeight: '600' },
  image: { width: '100%', height: 140, borderRadius: 6, marginVertical: 8, backgroundColor: '#f0f0f0' },
  meta: { fontSize: 11, color: '#888', marginBottom: 8 },
  actions: { flexDirection: 'row', gap: 8 },
  action: { flex: 1 },
});
