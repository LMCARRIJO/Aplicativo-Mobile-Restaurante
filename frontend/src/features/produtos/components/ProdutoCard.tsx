import { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Botao } from '@/shared/components/Botao';
import { useTheme, type Cores } from '@/shared/theme';
import { formatarData, formatarPreco } from '@/shared/utils/format';
import { urlFoto } from '../services/produtosApi';
import { Produto } from '../types/Produto';

interface ProdutoCardProps {
  produto: Produto;
  onEdit: (id: number) => void;
  onDelete: () => void;
}

export function ProdutoCard({ produto, onEdit, onDelete }: ProdutoCardProps) {
  const { cores } = useTheme();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);

  const temPromocao = produto.preco_promocional != null && produto.preco_promocional !== '';
  const foto = urlFoto(produto.foto_path);

  return (
    <View style={estilos.card}>
      <View style={estilos.topo}>
        <Text style={estilos.title}>{produto.nome}</Text>
        <View style={[estilos.badge, produto.disponivel ? estilos.badgeDisponivel : estilos.badgeEsgotado]}>
          <Text style={[estilos.badgeTexto, produto.disponivel ? estilos.badgeTextoOk : estilos.badgeTextoNao]}>
            {produto.disponivel ? 'Disponível' : 'Esgotado'}
          </Text>
        </View>
      </View>

      <View style={estilos.precos}>
        {temPromocao ? (
          <>
            <Text style={estilos.precoPromocional}>{formatarPreco(produto.preco_promocional as string)}</Text>
            <Text style={estilos.precoOriginal}>{formatarPreco(produto.preco)}</Text>
          </>
        ) : (
          <Text style={estilos.preco}>{formatarPreco(produto.preco)}</Text>
        )}
      </View>

      {foto ? <Image source={{ uri: foto }} style={estilos.image} /> : null}
      {produto.descricao ? <Text style={estilos.meta}>{produto.descricao}</Text> : null}
      {produto.categoria ? (
        <Text style={estilos.meta}>
          {produto.categoria}
          {produto.porcao ? ` • Serve ${produto.porcao}` : ''}
        </Text>
      ) : null}
      {produto.ingredientes ? <Text style={estilos.meta}>Ingredientes: {produto.ingredientes}</Text> : null}
      {produto.alergenicos ? <Text style={estilos.meta}>Alergênicos: {produto.alergenicos}</Text> : null}
      {produto.promocao_fim ? (
        <Text style={estilos.promocao}>Promoção até {formatarData(produto.promocao_fim)}</Text>
      ) : null}
      <Text style={estilos.meta}>
        ID {produto.id} • {formatarData(produto.created_at)}
      </Text>

      <View style={estilos.actions}>
        <Botao title="Editar" onPress={() => onEdit(produto.id)} containerStyle={estilos.action} />
        <Botao title="Excluir" variant="danger" onPress={onDelete} containerStyle={estilos.action} />
      </View>
    </View>
  );
}

const criarEstilos = (c: Cores) =>
  StyleSheet.create({
    card: {
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      padding: 14,
      borderRadius: 14,
      marginBottom: 12,
    },
    topo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    title: { fontWeight: '700', fontSize: 16, color: c.text, flex: 1 },
    badge: { borderRadius: 12, paddingVertical: 3, paddingHorizontal: 10 },
    badgeDisponivel: { backgroundColor: c.badgeDisponivelBg },
    badgeEsgotado: { backgroundColor: c.badgeEsgotadoBg },
    badgeTexto: { fontSize: 10, fontWeight: '700' },
    badgeTextoOk: { color: c.badgeDisponivelTexto },
    badgeTextoNao: { color: c.badgeEsgotadoTexto },
    precos: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 6 },
    preco: { fontSize: 16, fontWeight: '700', color: c.text },
    precoPromocional: { fontSize: 16, fontWeight: '700', color: c.danger },
    precoOriginal: { fontSize: 12, color: c.muted, textDecorationLine: 'line-through' },
    image: { width: '100%', height: 150, borderRadius: 10, marginVertical: 10, backgroundColor: c.fotoFundo },
    meta: { fontSize: 12, color: c.muted, marginBottom: 4 },
    promocao: { fontSize: 12, color: c.danger, fontWeight: '600', marginBottom: 8 },
    actions: { flexDirection: 'row', gap: 8, marginTop: 8 },
    action: { flex: 1 },
  });