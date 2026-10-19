import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Botao } from '@/shared/components/Botao';
import { useTheme, type Cores } from '@/shared/theme';
import { minutosDecorridos, tempoDecorrido } from '@/shared/utils/format';
import type { Pedido } from '@/features/garcom/types/Pedido';
import { metaUrgencia, urgencia } from '../constants';

interface CardComandaCozinhaProps {
  pedido: Pedido;
  /** Só para comandas em preparo: avisa a cozinha que ficou pronta. */
  onPronto?: () => void;
  marcando?: boolean;
}

/**
 * Comanda no painel da cozinha: mesa, tempo de espera, itens com as
 * observações em destaque e o botão para avisar que ficou pronta.
 */
export function CardComandaCozinha({ pedido, onPronto, marcando }: CardComandaCozinhaProps) {
  const { cores } = useTheme();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);

  const pronta = pedido.status === 'pronto';
  const desde = pronta ? pedido.pronto_em : pedido.enviado_em;
  const meta = metaUrgencia(urgencia(minutosDecorridos(desde)), cores);
  const itens = pedido.itens.reduce((soma, item) => soma + item.quantidade, 0);

  return (
    <View style={[estilos.card, { borderLeftColor: meta.faixa }]}>
      <View style={estilos.topo}>
        <Text style={estilos.mesa}>Mesa {pedido.mesa?.numero ?? pedido.mesa_id}</Text>
        <View style={[estilos.tempo, { backgroundColor: meta.bg }]}>
          <Text style={[estilos.tempoTexto, { color: meta.texto }]}>
            {pronta ? 'pronta há' : 'na cozinha há'} {tempoDecorrido(desde)}
          </Text>
        </View>
      </View>

      <Text style={estilos.resumo}>
        {itens} {itens === 1 ? 'item' : 'itens'} • {meta.rotulo}
      </Text>

      <View style={estilos.itens}>
        {pedido.itens.map((item) => (
          <View key={item.id}>
            <Text style={estilos.itemTexto}>
              <Text style={estilos.itemQuantidade}>{item.quantidade}× </Text>
              {item.produto_nome}
            </Text>
            {item.observacao ? <Text style={estilos.itemObservacao}>⚠ {item.observacao}</Text> : null}
          </View>
        ))}
      </View>

      {pedido.observacao ? (
        <Text style={estilos.observacao}>Observação da mesa: {pedido.observacao}</Text>
      ) : null}

      {onPronto ? (
        <Botao
          title="Marcar como pronto"
          onPress={onPronto}
          loading={marcando}
          containerStyle={estilos.botao}
        />
      ) : (
        <Text style={estilos.retirada}>Pronta — aguardando o garçom retirar.</Text>
      )}
    </View>
  );
}

const criarEstilos = (c: Cores) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderLeftWidth: 6,
      borderRadius: 14,
      padding: 14,
      marginBottom: 12,
    },
    topo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    mesa: { fontSize: 20, fontWeight: '800', color: c.text },
    tempo: { borderRadius: 12, paddingVertical: 4, paddingHorizontal: 10 },
    tempoTexto: { fontSize: 12, fontWeight: '700' },
    resumo: { fontSize: 12, color: c.muted, marginTop: 4 },
    itens: { marginTop: 10, gap: 6 },
    itemTexto: { fontSize: 15, color: c.text },
    itemQuantidade: { fontWeight: '800', color: c.primary },
    itemObservacao: { fontSize: 13, fontWeight: '600', color: c.warning, marginTop: 1 },
    observacao: { fontSize: 13, color: c.text, fontStyle: 'italic', marginTop: 10 },
    botao: { marginTop: 12 },
    retirada: { fontSize: 13, fontWeight: '700', color: c.success, marginTop: 12 },
  });
