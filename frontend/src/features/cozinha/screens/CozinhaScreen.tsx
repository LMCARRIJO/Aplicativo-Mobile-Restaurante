import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, SectionList, StyleSheet, Text, View } from 'react-native';
import { Botao } from '@/shared/components/Botao';
import { useTheme, type Cores } from '@/shared/theme';
import type { Pedido } from '@/features/garcom/types/Pedido';
import { CardComandaCozinha } from '../components/CardComandaCozinha';
import { INTERVALO_POLLING_MS, useFilaCozinha, useMarcarPronto } from '../hooks/useCozinha';
import type { FilaStatus } from '../services/cozinhaApi';

interface Secao {
  title: string;
  chave: FilaStatus;
  data: Pedido[];
}

function horaMinuto(timestamp: number): string {
  if (!timestamp) return '--:--';
  const data = new Date(timestamp);
  return `${String(data.getHours()).padStart(2, '0')}:${String(data.getMinutes()).padStart(2, '0')}`;
}

/**
 * Painel da cozinha: fila de comandas em preparo e, abaixo, as prontas
 * aguardando o garçom retirar. Atualiza sozinho a cada 10 segundos.
 */
export default function CozinhaScreen() {
  const { cores } = useTheme();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);

  const preparo = useFilaCozinha('em_preparo');
  const prontas = useFilaCozinha('pronto');
  const marcar = useMarcarPronto();
  const [atualizando, setAtualizando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      preparo.reload();
      prontas.reload();
    }, [preparo.reload, prontas.reload]),
  );

  /** Puxar a lista (ou apertar "Atualizar") não pode brigar com o polling automático. */
  const atualizarAgora = useCallback(async () => {
    setAtualizando(true);
    try {
      await Promise.all([preparo.refresh(), prontas.refresh()]);
    } finally {
      setAtualizando(false);
    }
  }, [preparo.refresh, prontas.refresh]);

  const carregando = preparo.loading && prontas.loading;
  const erro = preparo.erro ?? prontas.erro;
  const atualizadoEm = Math.max(preparo.atualizadoEm, prontas.atualizadoEm);
  const vazia = preparo.pedidos.length === 0 && prontas.pedidos.length === 0;

  const secoes: Secao[] = [
    { title: 'Em preparo', chave: 'em_preparo', data: preparo.pedidos },
    { title: 'Prontas aguardando retirada', chave: 'pronto', data: prontas.pedidos },
  ];

  return (
    <View style={estilos.container}>
      <View style={estilos.cabecalho}>
        <View style={estilos.resumoLinha}>
          <Text style={estilos.resumo}>
            {preparo.pedidos.length} em preparo • {prontas.pedidos.length} prontas
          </Text>
          <Text style={estilos.atualizado}>Atualizado às {horaMinuto(atualizadoEm)}</Text>
        </View>
        <Botao title="Atualizar" variant="secondary" loading={atualizando} onPress={atualizarAgora} />
      </View>
      <Text style={estilos.aviso}>
        A tela se atualiza sozinha a cada {INTERVALO_POLLING_MS / 1000} segundos.
      </Text>

      {carregando ? (
        <ActivityIndicator style={estilos.loading} color={cores.primary} />
      ) : (
        <SectionList<Pedido, Secao>
          sections={vazia ? [] : secoes}
          keyExtractor={(item) => String(item.id)}
          stickySectionHeadersEnabled={false}
          refreshing={atualizando}
          onRefresh={atualizarAgora}
          contentContainerStyle={estilos.lista}
          renderSectionHeader={({ section }) =>
            section.data.length === 0 ? null : (
              <Text style={estilos.tituloSecao}>
                {section.title} ({section.data.length})
              </Text>
            )
          }
          renderItem={({ item, section }) => (
            <CardComandaCozinha
              pedido={item}
              marcando={marcar.isPending && marcar.variables === item.id}
              onPronto={section.chave === 'em_preparo' ? () => marcar.mutate(item.id) : undefined}
            />
          )}
          ListEmptyComponent={
            <Text style={erro ? estilos.erro : estilos.vazio}>
              {erro ?? 'Nada na cozinha agora. As comandas enviadas pelo garçom aparecem aqui.'}
            </Text>
          }
        />
      )}
    </View>
  );
}

const criarEstilos = (c: Cores) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    cabecalho: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: 16,
      paddingBottom: 6,
    },
    resumoLinha: { gap: 2 },
    resumo: { fontSize: 13, fontWeight: '700', color: c.text },
    atualizado: { fontSize: 12, color: c.muted },
    aviso: { fontSize: 11, color: c.muted, paddingHorizontal: 16, paddingBottom: 10 },
    loading: { marginTop: 32 },
    lista: { paddingHorizontal: 16, paddingBottom: 40 },
    tituloSecao: {
      fontSize: 13,
      fontWeight: '800',
      color: c.muted,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      marginTop: 12,
      marginBottom: 8,
    },
    vazio: { textAlign: 'center', color: c.muted, marginTop: 32 },
    erro: { textAlign: 'center', color: c.danger, marginTop: 32 },
  });
