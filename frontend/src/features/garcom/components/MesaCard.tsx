import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme, type Cores } from '@/shared/theme';
import { formatarPreco } from '@/shared/utils/format';
import { ROTULO_STATUS, tempoDecorrido } from '../constants';
import type { Mesa } from '../types/Mesa';

interface MesaCardProps {
  mesa: Mesa;
  onAbrir: () => void;
  onEditar: () => void;
}

/** Cartão da mesa na grade do salão. Toque abre a comanda, o lápis edita a mesa. */
export function MesaCard({ mesa, onAbrir, onEditar }: MesaCardProps) {
  const { cores } = useTheme();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);

  const pedido = mesa.pedido_ativo;
  const ocupada = mesa.status === 'ocupada' && pedido !== null;

  return (
    <Pressable
      onPress={onAbrir}
      style={({ pressed }) => [
        estilos.card,
        ocupada && estilos.cardOcupada,
        !mesa.ativa && estilos.cardInativa,
        pressed && estilos.pressionado,
      ]}
    >
      <View style={estilos.topo}>
        <Text style={estilos.numero}>{mesa.numero}</Text>
        <Pressable onPress={onEditar} hitSlop={10} style={estilos.lapis}>
          <Text style={estilos.lapisTexto}>Editar</Text>
        </Pressable>
      </View>

      <Text style={ocupada ? estilos.statusOcupada : estilos.statusLivre}>
        {!mesa.ativa ? 'Inativa' : ocupada ? 'Ocupada' : 'Livre'}
      </Text>

      {mesa.capacidade ? <Text style={estilos.meta}>Até {mesa.capacidade} pessoas</Text> : null}

      {ocupada ? (
        <View style={estilos.resumo}>
          <Text style={estilos.resumoTempo}>{tempoDecorrido(pedido.aberto_em)}</Text>
          <Text style={estilos.resumoTexto}>
            {pedido.itens_count} {pedido.itens_count === 1 ? 'item' : 'itens'} • {formatarPreco(pedido.total)}
          </Text>
          <Text style={estilos.resumoStatus}>{ROTULO_STATUS[pedido.status]}</Text>
        </View>
      ) : (
        <Text style={estilos.livreTexto}>Toque para abrir a comanda</Text>
      )}
    </Pressable>
  );
}

const criarEstilos = (c: Cores) =>
  StyleSheet.create({
    card: {
      flex: 1,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      borderRadius: 14,
      padding: 14,
    },
    cardOcupada: { borderColor: c.primary, borderWidth: 2 },
    cardInativa: { opacity: 0.55 },
    pressionado: { opacity: 0.7 },
    topo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    numero: { fontSize: 30, fontWeight: '800', color: c.text },
    lapis: { paddingHorizontal: 6, paddingVertical: 2 },
    lapisTexto: { fontSize: 11, fontWeight: '600', color: c.primary },
    statusLivre: { fontSize: 12, fontWeight: '700', color: c.success, marginTop: 2 },
    statusOcupada: { fontSize: 12, fontWeight: '700', color: c.primary, marginTop: 2 },
    meta: { fontSize: 12, color: c.muted, marginTop: 4 },
    resumo: { marginTop: 8, gap: 2 },
    resumoTempo: { fontSize: 12, fontWeight: '700', color: c.text },
    resumoTexto: { fontSize: 12, color: c.muted },
    resumoStatus: { fontSize: 11, fontWeight: '700', color: c.primary, marginTop: 2 },
    livreTexto: { fontSize: 11, color: c.muted, marginTop: 10 },
  });
