import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Botao } from '@/shared/components/Botao';
import { ModalConfirmacao } from '@/shared/components/ModalConfirmacao';
import { mensagemErro } from '@/shared/lib/http';
import { useTheme, type Cores } from '@/shared/theme';
import { alerta } from '@/shared/utils/dialogos';
import { MesaForm } from '../components/MesaForm';
import { useExcluirMesa, useMesa, useSalvarMesa } from '../hooks/useMesas';
import type { MesaInput } from '../types/Mesa';

export default function MesaFormScreen() {
  const { cores } = useTheme();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);

  const { id } = useLocalSearchParams<{ id?: string }>();
  const temId = id != null && id !== '';
  const numeroId = temId && !Number.isNaN(Number(id)) ? Number(id) : undefined;
  const editando = numeroId != null;
  const idInvalido = temId && numeroId === undefined;

  const mesaQuery = useMesa(numeroId);
  const { mutateAsync, isPending } = useSalvarMesa();
  const excluir = useExcluirMesa();
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

  const handleSubmit = async (data: MesaInput) => {
    try {
      await mutateAsync({ id: numeroId, input: data });
      await alerta('Sucesso', editando ? 'Mesa atualizada.' : 'Mesa criada.');
      router.back();
    } catch (e) {
      await alerta('Erro ao salvar', mensagemErro(e));
    }
  };

  const confirmarExclusao = async () => {
    if (numeroId == null) return;
    setConfirmandoExclusao(false);
    try {
      await excluir.mutateAsync(numeroId);
      await alerta('Sucesso', 'Mesa excluída.');
      router.back();
    } catch {
      // useExcluirMesa já mostra o motivo (ex: comanda ativa)
    }
  };

  if (editando && mesaQuery.isLoading) {
    return (
      <View style={estilos.center}>
        <ActivityIndicator color={cores.primary} />
      </View>
    );
  }

  if (idInvalido || (editando && mesaQuery.isError)) {
    return (
      <View style={estilos.center}>
        <Text style={estilos.aviso}>Mesa não encontrada.</Text>
        <Botao title="Voltar" onPress={() => router.back()} containerStyle={estilos.voltar} />
      </View>
    );
  }

  const mesa = mesaQuery.data;

  return (
    <View style={estilos.container}>
      <MesaForm
        initial={
          mesa
            ? {
                numero: String(mesa.numero),
                capacidade: mesa.capacidade != null ? String(mesa.capacidade) : '',
                ativa: mesa.ativa,
              }
            : undefined
        }
        submitting={isPending}
        submitLabel={editando ? 'Salvar alterações' : 'Criar mesa'}
        onSubmit={handleSubmit}
      />

      {editando ? (
        <Botao
          title="Excluir mesa"
          variant="danger"
          loading={excluir.isPending}
          onPress={() => setConfirmandoExclusao(true)}
          containerStyle={estilos.excluir}
        />
      ) : null}

      <ModalConfirmacao
        visible={confirmandoExclusao}
        titulo="Excluir mesa"
        mensagem={mesa ? `Deseja excluir a mesa ${mesa.numero}?` : ''}
        textoConfirmar="Excluir"
        onConfirmar={confirmarExclusao}
        onCancelar={() => setConfirmandoExclusao(false)}
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
    excluir: { marginHorizontal: 16, marginBottom: 24 },
  });
