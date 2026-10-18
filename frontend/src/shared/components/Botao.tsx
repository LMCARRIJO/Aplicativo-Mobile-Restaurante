import { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { radius, useTheme, type Cores } from '@/shared/theme';

interface BotaoProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: 'primary' | 'danger' | 'secondary';
  loading?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Botao({ title, variant = 'primary', loading, disabled, containerStyle, ...rest }: BotaoProps) {
  const { cores } = useTheme();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);
  const secundario = variant === 'secondary';

  return (
    <Pressable
      disabled={disabled || loading}
      style={[
        estilos.base,
        variant === 'danger' ? estilos.danger : secundario ? estilos.secondary : estilos.primary,
        (disabled || loading) && estilos.disabled,
        containerStyle,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={secundario ? cores.text : cores.onPrimary} />
      ) : (
        <Text style={secundario ? estilos.textoSecundario : estilos.texto}>{title}</Text>
      )}
    </Pressable>
  );
}

const criarEstilos = (c: Cores) =>
  StyleSheet.create({
    base: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
    primary: { backgroundColor: c.primary },
    danger: { backgroundColor: c.danger },
    secondary: { backgroundColor: c.card, borderWidth: 1, borderColor: c.border },
    disabled: { opacity: 0.5 },
    texto: { color: c.onPrimary, fontWeight: '700', fontSize: 15 },
    textoSecundario: { color: c.text, fontWeight: '600', fontSize: 15 },
  });