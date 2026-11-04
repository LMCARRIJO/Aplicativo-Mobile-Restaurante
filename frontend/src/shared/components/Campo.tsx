import { useMemo } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { radius, useTheme, type Cores } from '@/shared/theme';

interface CampoProps extends TextInputProps {
  label: string;
  erro?: string;
}

export function Campo({ label, style, erro, ...rest }: CampoProps) {
  const { cores } = useTheme();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);

  return (
    <View style={estilos.container}>
      <Text style={estilos.label}>{label}</Text>
      <TextInput
        style={[estilos.input, rest.multiline && estilos.textArea, erro && estilos.inputErro, style]}
        placeholderTextColor={cores.placeholder}
        {...rest}
      />
      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
    </View>
  );
}

const criarEstilos = (c: Cores) =>
  StyleSheet.create({
    container: { marginBottom: 12 },
    label: { fontSize: 12, color: c.muted, marginBottom: 6, fontWeight: '600' },
    input: {
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: radius.md,
      padding: 12,
      color: c.text,
      fontSize: 15,
      backgroundColor: c.input,
    },
    textArea: { minHeight: 84, textAlignVertical: 'top' },
    inputErro: { borderColor: c.danger },
    erro: { color: c.danger, fontSize: 11, marginTop: 4 },
  });