import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface CampoProps extends TextInputProps {
  label: string;
}

export function Campo({ label, style, ...rest }: CampoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={[styles.input, style]} placeholderTextColor="#999" {...rest} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  label: { fontSize: 12, color: '#444', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8 },
});
