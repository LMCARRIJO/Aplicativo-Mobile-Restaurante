import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

interface BotaoProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: 'primary' | 'danger' | 'secondary';
  loading?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Botao({
  title,
  variant = 'primary',
  loading,
  disabled,
  containerStyle,
  ...rest
}: BotaoProps) {
  const danger = variant === 'danger';
  const secondary = variant === 'secondary';
  return (
    <Pressable
      disabled={disabled || loading}
      style={[
        styles.base,
        danger ? styles.danger : secondary ? styles.secondary : styles.primary,
        (disabled || loading) && styles.disabled,
        containerStyle,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? '#111' : '#fff'} />
      ) : (
        <Text style={secondary ? styles.textSecondary : styles.text}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: '#2563eb' },
  danger: { backgroundColor: '#c00' },
  secondary: { backgroundColor: '#e5e7eb' },
  disabled: { opacity: 0.5 },
  text: { color: '#fff', fontWeight: '600' },
  textSecondary: { color: '#111', fontWeight: '600' },
});
