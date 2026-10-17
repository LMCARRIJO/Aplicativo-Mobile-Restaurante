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
  variant?: 'primary' | 'danger';
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
  return (
    <Pressable
      disabled={disabled || loading}
      style={[
        styles.base,
        danger ? styles.danger : styles.primary,
        (disabled || loading) && styles.disabled,
        containerStyle,
      ]}
      {...rest}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
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
  disabled: { opacity: 0.5 },
  text: { color: '#fff', fontWeight: '600' },
});
