import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Botao } from '@/shared/components/Botao';
import { useTheme, type Cores } from '@/shared/theme';
import { MesaCard } from '../components/MesaCard';
import { useMesas } from '../hooks/useMesas';
import type { StatusMesa } from '../types/Mesa';

type Filtro = StatusMesa | 'todas';

const FILTROS: { chave: Filtro; rotulo: string }[] = [
  { chave: 'todas', rotulo: 'Todas' },
  { chave: 'livre', rotulo: 'Livres' },
  { chave: 'ocupada', rotulo: 'Ocupadas' },
];

/** Tela inicial do garçom: o mapa de mesas do salão. */
export default function MesasScreen() {
  const { cores } = useTheme();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);
  const { mesas, loading, refreshing, erro, reload, refresh } = useMesas('todas');
  const [filtro, setFiltro] = useState<Filtro>('todas');

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const livres = mesas.filter((mesa) => mesa.status === 'livre').length;
  const ocupadas = mesas.length - livres;
  const visiveis = mesas.filter((mesa) => filtro === 'todas' || mesa.status === filtro);

  return (
    <View style={estilos.container}>
      <View style={estilos.cabecalho}>
        <Text style={estilos.resumo}>
          {mesas.length} mesas • {livres} livres • {ocupadas} ocupadas
        </Text>
        <Botao title="Nova mesa" onPress={() => router.push('/mesa/nova')} />
      </View>

      <View style={estilos.chips}>
        {FILTROS.map(({ chave, rotulo }) => {
          const ativo = filtro === chave;
          return (
            <Pressable
              key={chave}
              onPress={() => setFiltro(chave)}
              style={[estilos.chip, ativo && estilos.chipAtivo]}
            >
              <Text style={[estilos.chipTexto, ativo && estilos.chipTextoAtivo]}>{rotulo}</Text>
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <ActivityIndicator style={estilos.loading} color={cores.primary} />
      ) : (
        <FlatList
          data={visiveis}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          refreshing={refreshing}
          onRefresh={refresh}
          columnWrapperStyle={estilos.linhaGrade}
          contentContainerStyle={estilos.grade}
          renderItem={({ item }) => (
            <View style={estilos.celula}>
              <MesaCard
                mesa={item}
                onAbrir={() => router.push({ pathname: '/mesa/[id]', params: { id: String(item.id) } })}
                onEditar={() => router.push({ pathname: '/mesa/editar/[id]', params: { id: String(item.id) } })}
              />
            </View>
          )}
          ListEmptyComponent={
            <Text style={erro ? estilos.erro : estilos.vazio}>
              {erro ?? 'Nenhuma mesa por aqui. Cadastre a primeira em "Nova mesa".'}
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
    cabecalho: { padding: 16, paddingBottom: 8, gap: 10 },
    resumo: { fontSize: 13, color: c.muted },
    chips: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 12 },
    chip: {
      borderWidth: 1,
      borderColor: c.chipBorder,
      backgroundColor: c.chipBg,
      borderRadius: 20,
      paddingVertical: 6,
      paddingHorizontal: 14,
    },
    chipAtivo: { backgroundColor: c.chipAtivoBg, borderColor: c.chipAtivoBg },
    chipTexto: { fontSize: 12, color: c.chipTexto },
    chipTextoAtivo: { color: c.chipAtivoTexto, fontWeight: '700' },
    loading: { marginTop: 32 },
    grade: { paddingHorizontal: 16, paddingBottom: 40 },
    linhaGrade: { justifyContent: 'space-between' },
    celula: { width: '48%', marginBottom: 12 },
    vazio: { textAlign: 'center', color: c.muted, marginTop: 32 },
    erro: { textAlign: 'center', color: c.danger, marginTop: 32 },
  });
