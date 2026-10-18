import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, useTheme, type Cores } from '@/shared/theme';

interface SeletorChipsProps {
  label: string;
  opcoes: readonly string[];
  selecionados: string[];
  onToggle: (opcao: string) => void;
  erro?: string;
}

export function SeletorChips({ label, opcoes, selecionados, onToggle, erro }: SeletorChipsProps) {
  const { cores } = useTheme();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);

  return (
    <View style={estilos.container}>
      <Text style={estilos.label}>{label}</Text>
      <View style={estilos.chips}>
        {opcoes.map((opcao) => {
          const ativo = selecionados.includes(opcao);
          return (
            <Pressable
              key={opcao}
              onPress={() => onToggle(opcao)}
              style={[estilos.chip, ativo && estilos.chipAtivo]}
            >
              <Text style={[estilos.texto, ativo && estilos.textoAtivo]}>{opcao}</Text>
            </Pressable>
          );
        })}
      </View>
      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
    </View>
  );
}

const criarEstilos = (c: Cores) =>
  StyleSheet.create({
    container: { marginBottom: 12 },
    label: { fontSize: 12, color: c.muted, marginBottom: 6, fontWeight: '600' },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
      borderWidth: 1,
      borderColor: c.chipBorder,
      borderRadius: radius.lg,
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: c.chipBg,
    },
    chipAtivo: { backgroundColor: c.chipAtivoBg, borderColor: c.chipAtivoBg },
    texto: { fontSize: 12, color: c.chipTexto },
    textoAtivo: { color: c.chipAtivoTexto, fontWeight: '700' },
    erro: { color: c.danger, fontSize: 11, marginTop: 4 },
  });