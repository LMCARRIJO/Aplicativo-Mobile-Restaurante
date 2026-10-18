import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Botao } from '@/shared/components/Botao';
import { Campo } from '@/shared/components/Campo';
import { SeletorChips } from '@/shared/components/SeletorChips';
import { alerta } from '@/shared/utils/dialogos';
import { ALERGENICOS, CATEGORIAS } from '../constants';
import { ProdutoInput } from '../types/Produto';

interface ProdutoFormProps {
  initial?: Partial<ProdutoInput>;
  fotoAtualUrl?: string | null;
  submitting?: boolean;
  submitLabel?: string;
  onSubmit: (data: ProdutoInput) => void;
}

function separarAlergenicos(valor?: string): string[] {
  if (!valor) return [];
  return valor
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
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
  const [precoPromocional, setPrecoPromocional] = useState(initial?.preco_promocional ?? '');
  const [descricao, setDescricao] = useState(initial?.descricao ?? '');
  const [categoria, setCategoria] = useState(initial?.categoria ?? 'Prato Principal');
  const [ingredientes, setIngredientes] = useState(initial?.ingredientes ?? '');
  const [alergenicos, setAlergenicos] = useState<string[]>(() =>
    separarAlergenicos(initial?.alergenicos),
  );
  const [porcao, setPorcao] = useState(initial?.porcao ?? '');
  const [disponivel, setDisponivel] = useState(initial?.disponivel ?? true);
  const [promocaoFim, setPromocaoFim] = useState(initial?.promocao_fim ?? '');
  const [fotoUri, setFotoUri] = useState<string | undefined>(initial?.fotoUri);
  const [fotoFile, setFotoFile] = useState<File | undefined>(initial?.fotoFile);
  const [fotoName, setFotoName] = useState<string | undefined>(initial?.fotoName);
  const [fotoType, setFotoType] = useState<string | undefined>(initial?.fotoType);

  const selecionarFoto = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      alerta('Permissão necessária', 'Autorize o acesso à galeria para anexar uma foto.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!resultado.canceled) {
      const asset = resultado.assets[0];
      setFotoUri(asset.uri);
      setFotoFile(asset.file);
      setFotoName(asset.fileName ?? undefined);
      setFotoType(asset.mimeType ?? undefined);
    }
  };

  const toggleAlergenico = (opcao: string) => {
    setAlergenicos((prev) =>
      prev.includes(opcao) ? prev.filter((item) => item !== opcao) : [...prev, opcao],
    );
  };

  const handleSubmit = () => {
    if (!nome || !preco) {
      alerta('Preencha nome e preço');
      return;
    }
    onSubmit({
      nome,
      preco,
      preco_promocional: precoPromocional,
      descricao,
      ingredientes,
      alergenicos: alergenicos.join(', '),
      porcao,
      disponivel,
      promocao_fim: promocaoFim,
      categoria,
      fotoUri,
      fotoFile,
      fotoName,
      fotoType,
    });
  };

  const previewUri = fotoUri ?? fotoAtualUrl ?? null;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.form}
      keyboardShouldPersistTaps="handled"
    >
      <Campo label="Nome" placeholder="Ex: Moqueca Baiana" value={nome} onChangeText={setNome} />
      <Campo
        label="Preço (R$)"
        placeholder="Ex: 49.90"
        value={preco}
        onChangeText={setPreco}
        keyboardType="decimal-pad"
      />
      <Campo
        label="Preço promocional (R$, opcional)"
        placeholder="Ex: 39.90"
        value={precoPromocional}
        onChangeText={setPrecoPromocional}
        keyboardType="decimal-pad"
      />
      <SeletorChips
        label="Categoria"
        opcoes={CATEGORIAS}
        selecionados={[categoria]}
        onToggle={setCategoria}
      />
      <Campo
        label="Descrição"
        placeholder="Ex: Prato típico da Bahia"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />
      <Campo
        label="Ingredientes"
        placeholder="Ex: Peixe, leite de coco, azeite de dendê"
        value={ingredientes}
        onChangeText={setIngredientes}
        multiline
      />
      <SeletorChips
        label="Alergênicos"
        opcoes={ALERGENICOS}
        selecionados={alergenicos}
        onToggle={toggleAlergenico}
      />
      <Campo
        label="Porção (serve quantas pessoas)"
        placeholder="Ex: 2"
        value={porcao}
        onChangeText={setPorcao}
        keyboardType="number-pad"
      />
      <Campo
        label="Promoção até (AAAA-MM-DD, opcional)"
        placeholder="Ex: 2026-12-31"
        value={promocaoFim}
        onChangeText={setPromocaoFim}
      />

      <View style={styles.disponibilidade}>
        <View style={styles.disponibilidadeTexto}>
          <Text style={styles.disponibilidadeLabel}>Disponível no cardápio</Text>
          <Text style={styles.disponibilidadeHint}>
            {disponivel ? 'Será exibido como disponível' : 'Será exibido como esgotado'}
          </Text>
        </View>
        <Switch value={disponivel} onValueChange={setDisponivel} />
      </View>

      <View style={styles.fotoBloco}>
        <Text style={styles.fotoLabel}>Foto</Text>
        {previewUri ? <Image source={{ uri: previewUri }} style={styles.preview} /> : null}
        <Botao title={previewUri ? 'Trocar foto' : 'Selecionar foto'} onPress={selecionarFoto} />
      </View>

      <Botao title={submitLabel} loading={submitting} onPress={handleSubmit} containerStyle={styles.submit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  form: { padding: 16 },
  disponibilidade: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  disponibilidadeTexto: { flex: 1, paddingRight: 12 },
  disponibilidadeLabel: { fontSize: 12, color: '#444' },
  disponibilidadeHint: { fontSize: 11, color: '#888', marginTop: 2 },
  fotoBloco: { marginBottom: 10, gap: 8 },
  fotoLabel: { fontSize: 12, color: '#444' },
  preview: { width: '100%', height: 180, borderRadius: 6, backgroundColor: '#f0f0f0' },
  submit: { marginTop: 8 },
});
