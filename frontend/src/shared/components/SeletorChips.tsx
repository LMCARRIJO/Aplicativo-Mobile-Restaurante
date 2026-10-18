import { Pressable, StyleSheet, Text, View } from 'react-native';

interface SeletorChipsProps {
  label: string;
  opcoes: readonly string[];
  selecionados: string[];
  onToggle: (opcao: string) => void;
}

export function SeletorChips({ label, opcoes, selecionados, onToggle }: SeletorChipsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chips}>
        {opcoes.map((opcao) => {
          const ativo = selecionados.includes(opcao);
          return (
            <Pressable
              key={opcao}
              onPress={() => onToggle(opcao)}
              style={[styles.chip, ativo && styles.chipAtivo]}
            >
              <Text style={[styles.texto, ativo && styles.textoAtivo]}>{opcao}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  label: { fontSize: 12, color: '#444', marginBottom: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  chipAtivo: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  texto: { fontSize: 12, color: '#333' },
  textoAtivo: { color: '#fff', fontWeight: '600' },
});
