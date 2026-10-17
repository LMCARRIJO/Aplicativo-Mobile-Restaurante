import { Image, StyleSheet, Text, View } from 'react-native';
import { Botao } from '@/shared/components/Botao';
import { colors, radius, spacing } from '@/shared/theme';
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
      <View style={styles.row}>
        {produto.foto_url ? (
          <Image source={{ uri: produto.foto_url }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={styles.placeholderText}>Sem foto</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {produto.nome}
          </Text>
          <Text style={styles.preco}>{formatarPreco(produto.preco)}</Text>
          {produto.categoria ? <Text style={styles.badge}>{produto.categoria}</Text> : null}
        </View>
      </View>

      {produto.descricao ? (
        <Text style={styles.descricao} numberOfLines={2}>
          {produto.descricao}
        </Text>
      ) : null}

      <View style={styles.metaRow}>
        <Text style={styles.meta}>Estoque: {produto.quantidade_estoque ?? 0}</Text>
        {produto.data_validade ? (
          <Text style={styles.meta}>Validade: {formatarData(produto.data_validade)}</Text>
        ) : null}
      </View>

      <View style={styles.actions}>
        <Botao
          title="Editar"
          variant="outline"
          onPress={() => onEdit(produto.id)}
          containerStyle={styles.action}
        />
        <Botao title="Excluir" variant="danger" onPress={onDelete} containerStyle={styles.action} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  image: { width: 72, height: 72, borderRadius: radius.sm, backgroundColor: colors.border },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  placeholderText: { color: colors.muted, fontSize: 11 },
  info: { flex: 1, gap: 2 },
  title: { fontSize: 16, fontWeight: '700', color: colors.text },
  preco: { fontSize: 15, fontWeight: '700', color: colors.primary },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 4,
    backgroundColor: colors.background,
    color: colors.muted,
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  descricao: { color: colors.muted, fontSize: 13, marginTop: spacing.sm },
  metaRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.sm },
  meta: { fontSize: 12, color: colors.muted },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  action: { flex: 1 },
});