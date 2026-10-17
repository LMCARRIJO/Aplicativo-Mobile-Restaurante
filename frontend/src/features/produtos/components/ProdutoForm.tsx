import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { Botao } from '@/shared/components/Botao';
import { Campo } from '@/shared/components/Campo';
import { ProdutoInput } from '../types/Produto';

interface ProdutoFormProps {
  initial?: Partial<ProdutoInput>;
  fotoAtualUrl?: string | null;
  submitting?: boolean;
  submitLabel?: string;
  onSubmit: (data: ProdutoInput) => void;
}

export function ProdutoForm({
  initial,
  fotoAtualUrl,
  submitting,
  submitLabel = 'Salvar',
  onSubmit,
}: ProdutoFormProps) {
  const [nome, setNome] = useState(initial?.nome ?? '');
  const [preco, setPreco] = useState(initial?.preco ?? '');
  const [descricao, setDescricao] = useState(initial?.descricao ?? '');
  const [quantidadeEstoque, setQuantidadeEstoque] = useState(initial?.quantidade_estoque ?? '');
  const [dataValidade, setDataValidade] = useState(initial?.data_validade ?? '');
  const [categoria, setCategoria] = useState(initial?.categoria ?? '');
  const [fotoUri, setFotoUri] = useState<string | undefined>(initial?.fotoUri);

  const selecionarFoto = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Autorize o acesso à galeria para anexar uma foto.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!resultado.canceled) {
      setFotoUri(resultado.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!nome || !preco) return Alert.alert('Preencha nome e preço');
    onSubmit({
      nome,
      preco,
      descricao,
      quantidade_estoque: quantidadeEstoque,
      data_validade: dataValidade,
      categoria,
      fotoUri,
    });
  };

  const previewUri = fotoUri ?? fotoAtualUrl ?? null;

  return (
    <View style={styles.form}>
      <Campo label="Nome (string)" placeholder="Ex: Moqueca Baiana" value={nome} onChangeText={setNome} />
      <Campo
        label="Preço (number)"
        placeholder="Ex: 19.90"
        value={preco}
        onChangeText={setPreco}
        keyboardType="decimal-pad"
      />
      <Campo
        label="Descrição (string longa)"
        placeholder="Ex: Prato típico da Bahia"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />
      <Campo
        label="Estoque (número inteiro)"
        placeholder="Ex: 10"
        value={quantidadeEstoque}
        onChangeText={setQuantidadeEstoque}
        keyboardType="number-pad"
      />
      <Campo
        label="Validade (date AAAA-MM-DD)"
        placeholder="Ex: 2026-12-31"
        value={dataValidade}
        onChangeText={setDataValidade}
      />
      <Campo
        label="Categoria (string)"
        placeholder="Ex: Sobremesa"
        value={categoria}
        onChangeText={setCategoria}
      />

      <View style={styles.fotoBloco}>
        <Text style={styles.fotoLabel}>Foto</Text>
        {previewUri ? <Image source={{ uri: previewUri }} style={styles.preview} /> : null}
        <Botao title={previewUri ? 'Trocar foto' : 'Selecionar foto'} onPress={selecionarFoto} />
      </View>

      <Botao title={submitLabel} loading={submitting} onPress={handleSubmit} containerStyle={styles.submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { padding: 16 },
  fotoBloco: { marginBottom: 10, gap: 8 },
  fotoLabel: { fontSize: 12, color: '#444' },
  preview: { width: '100%', height: 180, borderRadius: 6, backgroundColor: '#f0f0f0' },
  submit: { marginTop: 8 },
});
