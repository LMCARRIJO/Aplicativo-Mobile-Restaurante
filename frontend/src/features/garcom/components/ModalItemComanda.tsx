import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Botao } from '@/shared/components/Botao';
import { Campo } from '@/shared/components/Campo';
import { radius, useTheme, type Cores } from '@/shared/theme';
import { formatarPreco } from '@/shared/utils/format';

interface ModalItemComandaProps {
  visible: boolean;
  titulo: string;
  nomeProduto: string;
  precoUnitario: string;
  quantidadeInicial: number;
  observacaoInicial?: string;
  precoFixo?: boolean;
  salvando?: boolean;
  onFechar: () => void;
  onConfirmar: (quantidade: number, observacao: string) => void;
}

const MAX_QUANTIDADE = 99;

/** Escolhe quantidade e observação de um item (novo ou já lançado na comanda). */
export function ModalItemComanda({
  visible,
  titulo,
  nomeProduto,
  precoUnitario,
  quantidadeInicial,
  observacaoInicial = '',
  precoFixo,
  salvando,
  onFechar,
  onConfirmar,
}: ModalItemComandaProps) {
  const { cores } = useTheme();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);
  const [quantidade, setQuantidade] = useState(quantidadeInicial);
  const [observacao, setObservacao] = useState(observacaoInicial);

  useEffect(() => {
    if (!visible) return;
    setQuantidade(quantidadeInicial);
    setObservacao(observacaoInicial);
  }, [visible, quantidadeInicial, observacaoInicial]);

  const preco = Number(precoUnitario) || 0;
  const total = preco * quantidade;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onFechar}>
      <View style={estilos.overlay}>
        <View style={estilos.caixa}>
          <Text style={estilos.titulo}>{titulo}</Text>
          <Text style={estilos.produto}>{nomeProduto}</Text>
          <Text style={estilos.preco}>
            {formatarPreco(preco)}{precoFixo ? ' (preço do cardápio)' : ' cada'}
          </Text>

          <Text style={estilos.label}>Quantidade</Text>
          <View style={estilos.stepper}>
            <Pressable
              onPress={() => setQuantidade((q) => Math.max(1, q - 1))}
              style={estilos.passo}
              disabled={quantidade <= 1}
            >
              <Text style={estilos.passoTexto}>−</Text>
            </Pressable>
            <Text style={estilos.quantidade}>{quantidade}</Text>
            <Pressable
              onPress={() => setQuantidade((q) => Math.min(MAX_QUANTIDADE, q + 1))}
              style={estilos.passo}
              disabled={quantidade >= MAX_QUANTIDADE}
            >
              <Text style={estilos.passoTexto}>+</Text>
            </Pressable>
          </View>

          <Campo
            label="Observação (opcional)"
            value={observacao}
            onChangeText={setObservacao}
            placeholder="Ex: sem cebola, bem passado"
            maxLength={255}
          />

          <Text style={estilos.total}>Subtotal: {formatarPreco(total)}</Text>

          <View style={estilos.acoes}>
            <Botao title="Cancelar" variant="secondary" onPress={onFechar} containerStyle={estilos.acao} />
            <Botao
              title="Confirmar"
              loading={salvando}
              onPress={() => onConfirmar(quantidade, observacao.trim())}
              containerStyle={estilos.acao}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const criarEstilos = (c: Cores) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: c.overlay,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    caixa: {
      width: '100%',
      maxWidth: 400,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: radius.lg,
      padding: 20,
    },
    titulo: { fontSize: 16, fontWeight: '700', color: c.text },
    produto: { fontSize: 15, fontWeight: '700', color: c.text, marginTop: 6 },
    preco: { fontSize: 12, color: c.muted, marginTop: 2, marginBottom: 12 },
    label: { fontSize: 12, color: c.muted, marginBottom: 6, fontWeight: '600' },
    stepper: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
    passo: {
      width: 42,
      height: 42,
      borderRadius: 21,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.input,
      alignItems: 'center',
      justifyContent: 'center',
    },
    passoTexto: { fontSize: 20, fontWeight: '700', color: c.text },
    quantidade: { fontSize: 20, fontWeight: '800', color: c.text, minWidth: 40, textAlign: 'center' },
    total: { fontSize: 14, fontWeight: '700', color: c.text, marginBottom: 16 },
    acoes: { flexDirection: 'row', gap: 8 },
    acao: { flex: 1 },
  });
