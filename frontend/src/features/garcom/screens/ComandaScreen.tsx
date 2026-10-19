import { Stack, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Botao } from '@/shared/components/Botao';
import { ModalConfirmacao } from '@/shared/components/ModalConfirmacao';
import { useTheme, type Cores } from '@/shared/theme';
import { alerta } from '@/shared/utils/dialogos';
import { formatarPreco, tempoDecorrido } from '@/shared/utils/format';
import type { Produto } from '@/features/produtos/types/Produto';
import { LinhaItemComanda } from '../components/LinhaItemComanda';
import { ModalItemComanda } from '../components/ModalItemComanda';
import { ModalSeletorProduto } from '../components/ModalSeletorProduto';
import { StatusBadge } from '../components/StatusBadge';
import { DESCRICAO_STATUS } from '../constants';
import {
  useAbrirComanda,
  useEnviarComanda,
  useItensComanda,
  usePedido,
  useStatusComanda,
} from '../hooks/useComanda';
import { useMesa } from '../hooks/useMesas';
import type { PedidoItem, StatusPedido } from '../types/Pedido';

/** Comanda da mesa: onde o garçom anota os itens e acompanha o status. */
export default function ComandaScreen() {
  const { cores } = useTheme();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);

  const { id } = useLocalSearchParams<{ id?: string }>();
  const mesaId = id != null && id !== '' && !Number.isNaN(Number(id)) ? Number(id) : undefined;
  const idInvalido = id != null && id !== '' && Number.isNaN(Number(id));

  const mesaQuery = useMesa(mesaId);
  const mesa = mesaQuery.data;
  const pedidoId = mesa?.pedido_ativo?.id;

  const pedidoQuery = usePedido(pedidoId);
  const pedido = pedidoQuery.data;

  const abrir = useAbrirComanda(mesaId as number);
  const enviar = useEnviarComanda(pedidoId);
  const status = useStatusComanda(pedidoId);
  const itens = useItensComanda(pedidoId);

  const [seletorAberto, setSeletorAberto] = useState(false);
  const [produtoEscolhido, setProdutoEscolhido] = useState<Produto | null>(null);
  const [itemEditando, setItemEditando] = useState<PedidoItem | null>(null);
  const [itemRemovendo, setItemRemovendo] = useState<PedidoItem | null>(null);
  const [confirmandoCancelamento, setConfirmandoCancelamento] = useState(false);
  const [confirmandoEnvio, setConfirmandoEnvio] = useState(false);

  const { refetch: recarregarMesa } = mesaQuery;
  const { refetch: recarregarPedido } = pedidoQuery;

  useFocusEffect(
    useCallback(() => {
      recarregarMesa();
      recarregarPedido();
    }, [recarregarMesa, recarregarPedido]),
  );

  const modalItem = useMemo(() => {
    if (produtoEscolhido) {
      return {
        titulo: 'Adicionar item',
        nomeProduto: produtoEscolhido.nome,
        precoUnitario: String(produtoEscolhido.preco_promocional || produtoEscolhido.preco),
        quantidadeInicial: 1,
        observacaoInicial: '',
      };
    }
    if (itemEditando) {
      return {
        titulo: 'Editar item',
        nomeProduto: itemEditando.produto_nome,
        precoUnitario: itemEditando.preco_unitario,
        quantidadeInicial: itemEditando.quantidade,
        observacaoInicial: itemEditando.observacao ?? '',
      };
    }
    return null;
  }, [produtoEscolhido, itemEditando]);

  const fecharModalItem = () => {
    setProdutoEscolhido(null);
    setItemEditando(null);
  };

  const confirmarItem = async (quantidade: number, observacao: string) => {
    try {
      if (produtoEscolhido) {
        await itens.adicionar.mutateAsync({
          produto_id: produtoEscolhido.id,
          quantidade,
          observacao: observacao || null,
        });
      } else if (itemEditando) {
        await itens.atualizar.mutateAsync({
          itemId: itemEditando.id,
          input: { quantidade, observacao: observacao || null },
        });
      }
      fecharModalItem();
    } catch {
      // os hooks já avisam o motivo
    }
  };

  const abrirComanda = async () => {
    try {
      await abrir.mutateAsync(undefined);
    } catch {
      // hook já avisa
    }
  };

  const mudarStatus = async (novo: StatusPedido, mensagem: string) => {
    try {
      await status.mutateAsync(novo);
      await alerta('Comanda atualizada', mensagem);
    } catch {
      // hook já avisa
    }
  };

  const enviarParaCozinha = async () => {
    setConfirmandoEnvio(false);
    try {
      await enviar.mutateAsync();
      await alerta('Comanda enviada', 'A cozinha já pode ver esta comanda.');
    } catch {
      // hook já avisa
    }
  };

  const excluirItem = async () => {
    const alvo = itemRemovendo;
    setItemRemovendo(null);
    if (!alvo) return;
    try {
      await itens.remover.mutateAsync(alvo.id);
    } catch {
      // hook já avisa
    }
  };

  if (mesaQuery.isLoading || idInvalido || (mesaQuery.isError && !idInvalido)) {
    return (
      <View style={estilos.center}>
        {mesaQuery.isLoading && !idInvalido ? (
          <ActivityIndicator color={cores.primary} />
        ) : (
          <>
            <Text style={estilos.aviso}>Mesa não encontrada.</Text>
            <Botao title="Voltar" onPress={() => router.back()} containerStyle={estilos.voltar} />
          </>
        )}
      </View>
    );
  }

  if (!mesa) {
    return (
      <View style={estilos.center}>
        <Text style={estilos.aviso}>Mesa não encontrada.</Text>
        <Botao title="Voltar" onPress={() => router.back()} containerStyle={estilos.voltar} />
      </View>
    );
  }

  const editavel = pedido?.status === 'aberto';
  const abertura = pedido?.criado_em ?? mesa.pedido_ativo?.aberto_em;

  return (
    <View style={estilos.container}>
      <Stack.Screen options={{ title: `Mesa ${mesa.numero}` }} />

      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={estilos.cabecalho}>
          <View style={estilos.cabecalhoTopo}>
            <Text style={estilos.numero}>Mesa {mesa.numero}</Text>
            {pedido ? <StatusBadge status={pedido.status} /> : null}
          </View>
          {mesa.capacidade ? (
            <Text style={estilos.meta}>Capacidade: {mesa.capacidade} pessoas</Text>
          ) : null}
          {abertura ? <Text style={estilos.meta}>Aberta há {tempoDecorrido(abertura)}</Text> : null}
        </View>

        {!pedido ? (
          <View style={estilos.vazioCard}>
            <Text style={estilos.vazioTitulo}>Mesa livre</Text>
            <Text style={estilos.vazioTexto}>
              {mesa.ativa
                ? 'Abra a comanda para começar a anotar os pedidos desta mesa.'
                : 'Esta mesa está inativa. Ative-a para poder receber comandas.'}
            </Text>
          </View>
        ) : (
          <>
            <Text style={estilos.statusTexto}>{DESCRICAO_STATUS[pedido.status]}</Text>

            {pedido.itens.length === 0 ? (
              <Text style={estilos.semItens}>Nenhum item lançado ainda.</Text>
            ) : (
              pedido.itens.map((item) => (
                <LinhaItemComanda
                  key={item.id}
                  item={item}
                  editavel={editavel}
                  onEditar={() => setItemEditando(item)}
                  onRemover={() => setItemRemovendo(item)}
                />
              ))
            )}

            <View style={estilos.totalCaixa}>
              <Text style={estilos.totalLabel}>Total da comanda</Text>
              <Text style={estilos.totalValor}>{formatarPreco(pedido.total)}</Text>
            </View>
          </>
        )}
      </ScrollView>

      <View style={estilos.rodape}>
        {!pedido ? (
          <Botao
            title={mesa.ativa ? 'Abrir comanda' : 'Mesa inativa'}
            disabled={!mesa.ativa}
            loading={abrir.isPending}
            onPress={abrirComanda}
          />
        ) : pedido.status === 'aberto' ? (
          <>
            <Botao title="Adicionar item" onPress={() => setSeletorAberto(true)} />
            <Botao
              title="Enviar para a cozinha"
              variant="secondary"
              loading={enviar.isPending}
              disabled={pedido.itens.length === 0}
              onPress={() => setConfirmandoEnvio(true)}
            />
            <Botao
              title="Cancelar comanda"
              variant="danger"
              onPress={() => setConfirmandoCancelamento(true)}
            />
          </>
        ) : pedido.status === 'em_preparo' ? (
          <>
            <Botao
              title="Marcar como pronto"
              loading={status.isPending}
              onPress={() => mudarStatus('pronto', 'A comanda está pronta para ser levada à mesa.')}
            />
            <Botao
              title="Cancelar comanda"
              variant="danger"
              onPress={() => setConfirmandoCancelamento(true)}
            />
          </>
        ) : (
          <>
            <Botao
              title="Entregar na mesa"
              loading={status.isPending}
              onPress={() =>
                mudarStatus('entregue', 'Comanda entregue. Esta mesa já está livre para novos pedidos.')
              }
            />
            <Botao
              title="Cancelar comanda"
              variant="danger"
              onPress={() => setConfirmandoCancelamento(true)}
            />
          </>
        )}
      </View>

      <ModalSeletorProduto
        visible={seletorAberto}
        onFechar={() => setSeletorAberto(false)}
        onSelecionar={(produto) => {
          setSeletorAberto(false);
          setProdutoEscolhido(produto);
        }}
      />

      <ModalItemComanda
        visible={modalItem !== null}
        titulo={modalItem?.titulo ?? ''}
        nomeProduto={modalItem?.nomeProduto ?? ''}
        precoUnitario={modalItem?.precoUnitario ?? '0'}
        quantidadeInicial={modalItem?.quantidadeInicial ?? 1}
        observacaoInicial={modalItem?.observacaoInicial ?? ''}
        precoFixo={produtoEscolhido !== null}
        salvando={itens.adicionar.isPending || itens.atualizar.isPending}
        onFechar={fecharModalItem}
        onConfirmar={confirmarItem}
      />

      <ModalConfirmacao
        visible={itemRemovendo !== null}
        titulo="Remover item"
        mensagem={itemRemovendo ? `Remover "${itemRemovendo.produto_nome}" da comanda?` : ''}
        textoConfirmar="Remover"
        onConfirmar={excluirItem}
        onCancelar={() => setItemRemovendo(null)}
      />

      <ModalConfirmacao
        visible={confirmandoEnvio}
        titulo="Enviar para a cozinha"
        mensagem="Depois de enviada, a comanda não pode mais ser alterada. Enviar agora?"
        textoConfirmar="Enviar"
        onConfirmar={enviarParaCozinha}
        onCancelar={() => setConfirmandoEnvio(false)}
      />

      <ModalConfirmacao
        visible={confirmandoCancelamento}
        titulo="Cancelar comanda"
        mensagem="A comanda será cancelada e a mesa liberada. Deseja continuar?"
        textoConfirmar="Cancelar comanda"
        textoCancelar="Voltar"
        onConfirmar={() => {
          setConfirmandoCancelamento(false);
          mudarStatus('cancelado', 'Comanda cancelada. Esta mesa já está livre.');
        }}
        onCancelar={() => setConfirmandoCancelamento(false)}
      />
    </View>
  );
}

const criarEstilos = (c: Cores) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: c.background },
    aviso: { color: c.muted, marginBottom: 16, fontSize: 14 },
    voltar: { minWidth: 160 },
    conteudo: { padding: 16, paddingBottom: 32 },
    cabecalho: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 14,
      padding: 14,
      marginBottom: 12,
    },
    cabecalhoTopo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    numero: { fontSize: 22, fontWeight: '800', color: c.text },
    meta: { fontSize: 12, color: c.muted, marginTop: 4 },
    statusTexto: { fontSize: 13, color: c.muted, marginBottom: 12 },
    semItens: { textAlign: 'center', color: c.muted, marginVertical: 24 },
    totalCaixa: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderColor: c.border,
      paddingTop: 12,
      marginTop: 8,
    },
    totalLabel: { fontSize: 14, fontWeight: '600', color: c.muted },
    totalValor: { fontSize: 20, fontWeight: '800', color: c.text },
    vazioCard: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 14,
      padding: 16,
    },
    vazioTitulo: { fontSize: 16, fontWeight: '700', color: c.text, marginBottom: 6 },
    vazioTexto: { fontSize: 13, color: c.muted },
    rodape: {
      padding: 16,
      gap: 8,
      borderTopWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
    },
  });
