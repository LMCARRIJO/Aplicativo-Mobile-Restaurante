import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme, type Cores } from '@/shared/theme';
import { formatarPreco } from '@/shared/utils/format';
import type { PedidoItem } from '../types/Pedido';

interface LinhaItemComandaProps {
  item: PedidoItem;
  editavel: boolean;
  onEditar: () => void;
  onRemover: () => void;
}

/** Um prato da comanda: toque para editar quantidade/observação. */
export function LinhaItemComanda({ item, editavel, onEditar, onRemover }: LinhaItemComandaProps) {
  const { cores } = useTheme();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);

  return (
    <Pressable
      onPress={editavel ? onEditar : undefined}
      style={({ pressed }) => [estilos.linha, pressed && editavel && estilos.pressionado]}
    >
      <View style={estilos.esquerda}>
        <Text style={estilos.nome}>
          {item.quantidade}x {item.produto_nome}
        </Text>
        <Text style={estilos.meta}>
          {formatarPreco(item.preco_unitario)} cada
          {item.produto_id === null ? ' • saiu do cardápio' : ''}
        </Text>
        {item.observacao ? <Text style={estilos.observacao}>Obs: {item.observacao}</Text> : null}
        {editavel ? <Text style={estilos.dica}>Toque para editar</Text> : null}
      </View>

      <View style={estilos.direita}>
        <Text style={estilos.subtotal}>{formatarPreco(item.subtotal)}</Text>
        {editavel ? (
          <Pressable onPress={onRemover} hitSlop={10} style={estilos.remover}>
            <Text style={estilos.removerTexto}>Remover</Text>
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

const criarEstilos = (c: Cores) =>
  StyleSheet.create({
    linha: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
    },
    pressionado: { opacity: 0.75 },
    esquerda: { flex: 1 },
    nome: { fontSize: 15, fontWeight: '700', color: c.text },
    meta: { fontSize: 12, color: c.muted, marginTop: 2 },
    observacao: { fontSize: 12, color: c.text, marginTop: 4, fontStyle: 'italic' },
    dica: { fontSize: 10, color: c.primary, marginTop: 4 },
    direita: { alignItems: 'flex-end', justifyContent: 'space-between' },
    subtotal: { fontSize: 15, fontWeight: '700', color: c.text },
    remover: { paddingVertical: 4 },
    removerTexto: { fontSize: 11, fontWeight: '600', color: c.danger },
  });
