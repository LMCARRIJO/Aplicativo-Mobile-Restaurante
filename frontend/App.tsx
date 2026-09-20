import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, Image, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { Produto } from './src/types/Produto';
import { API_URL, createProduto, deleteProduto, listProdutos } from './src/services/api';

export default function App() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const data = await listProdutos();
      setProdutos(data);
    } catch (e: any) {
      Alert.alert('Erro', e.message + `\nAPI: ${API_URL}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!nome || !preco) return Alert.alert('Preencha nome e preço');
    try {
      await createProduto({ nome, preco });
      setNome('');
      setPreco('');
      await load();
    } catch (e: any) {
      Alert.alert('Erro ao criar', e.message);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteProduto(id);
    await load();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurante Mobile - Produtos</Text>
      <Text style={styles.subtitle}>API: {API_URL}</Text>

      <View style={styles.form}>
        <TextInput placeholder="Nome (string)" value={nome} onChangeText={setNome} style={styles.input} />
        <TextInput placeholder="Preço (number ex: 19.90)" value={preco} onChangeText={setPreco} keyboardType="decimal-pad" style={styles.input} />
        <Text style={styles.hint}>Foto: use multipart/form-data via endpoint POST /api/produtos campo `foto`</Text>
        <Button title="Criar Produto (3 attrs base)" onPress={handleCreate} />
      </View>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.nome} - R$ {item.preco}</Text>
              {item.foto_url && <Image source={{ uri: item.foto_url }} style={styles.image} />}
              <Text style={styles.meta}>ID {item.id} • {new Date(item.created_at).toLocaleDateString()}</Text>
              {/* Oi, aqui você pode mostrar os campos novos quando liberar: descricao, quantidade_estoque, data_validade, categoria */}
              <Button title="Excluir" color="#c00" onPress={() => handleDelete(item.id)} />
            </View>
          )}
          ListEmptyComponent={<Text>Nenhum produto. Backend: GET {API_URL}/produtos</Text>}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50, paddingHorizontal: 16 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 10, color: '#666', textAlign: 'center', marginBottom: 12 },
  form: { gap: 8, marginBottom: 16, borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8 },
  hint: { fontSize: 10, color: '#888' },
  card: { borderWidth: 1, borderColor: '#eee', padding: 12, borderRadius: 8, marginBottom: 8 },
  cardTitle: { fontWeight: '600' },
  image: { width: '100%', height: 140, borderRadius: 6, marginVertical: 8, backgroundColor: '#f0f0f0' },
  meta: { fontSize: 10, color: '#999', marginBottom: 8 },
});
