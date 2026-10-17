import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { colors, radius } from '@/shared/theme';

interface BotaoProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: 'primary' | 'danger' | 'outline' | 'ghost';
  loading?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Botao({
  title,
  variant = 'primary',
  loading,
  disabled,
  containerStyle,
  textStyle,
  ...rest
}: BotaoProps) {
  const outline = variant === 'outline';
  const ghost = variant === 'ghost';
  const spinner = outline || ghost ? colors.primary : colors.white;

  return (
    <Pressable
      disabled={disabled || loading}
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'danger' && styles.danger,
        outline && styles.outline,
        ghost && styles.ghost,
        (disabled || loading) && styles.disabled,
        containerStyle,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={spinner} />
      ) : (
        <Text
          style={[styles.text, outline && styles.textOutline, ghost && styles.textGhost, textStyle]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.primary },
  danger: { backgroundColor: colors.danger },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  ghost: { backgroundColor: 'transparent' },
  disabled: { opacity: 0.5 },
  text: { color: colors.white, fontWeight: '700', fontSize: 15 },
  textOutline: { color: colors.primary },
  textGhost: { color: colors.muted },
});