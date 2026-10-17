import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { Botao } from '@/shared/components/Botao';
import { Campo } from '@/shared/components/Campo';
import { colors, radius, spacing } from '@/shared/theme';
import { ProdutoFormData, produtoSchema } from '../schemas/produtoSchema';

interface ProdutoFormProps {
  defaultValues?: Partial<ProdutoFormData>;
  fotoAtualUrl?: string | null;
  submitting?: boolean;
  submitLabel?: string;
  onSubmit: (dados: ProdutoFormData, fotoUri?: string) => void;
}

const VAZIO: ProdutoFormData = {
  nome: '',
  preco: '',
  descricao: '',
  quantidade_estoque: '',
  data_validade: '',
  categoria: '',
};

export function ProdutoForm({
  defaultValues,
  fotoAtualUrl,
  submitting,
  submitLabel = 'Salvar',
  onSubmit,
}: ProdutoFormProps) {
  const [fotoUri, setFotoUri] = useState<string | undefined>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: { ...VAZIO, ...defaultValues },
  });

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
    if (!resultado.canceled) setFotoUri(resultado.assets[0].uri);
  };

  const previewUri = fotoUri ?? fotoAtualUrl ?? null;

  return (
    <View style={styles.form}>
      <Controller
        control={control}
        name="nome"
        render={({ field }) => (
          <Campo
            label="Nome"
            placeholder="Ex: Moqueca Baiana"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.nome?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="preco"
        render={({ field }) => (
          <Campo
            label="Preço (R$)"
            placeholder="Ex: 19.90"
            keyboardType="decimal-pad"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.preco?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="descricao"
        render={({ field }) => (
          <Campo
            label="Descrição"
            placeholder="Ex: Prato típico da Bahia"
            multiline
            value={field.value ?? ''}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.descricao?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="quantidade_estoque"
        render={({ field }) => (
          <Campo
            label="Estoque"
            placeholder="Ex: 10"
            keyboardType="number-pad"
            value={field.value ?? ''}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.quantidade_estoque?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="data_validade"
        render={({ field }) => (
          <Campo
            label="Validade (AAAA-MM-DD)"
            placeholder="Ex: 2026-12-31"
            value={field.value ?? ''}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.data_validade?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="categoria"
        render={({ field }) => (
          <Campo
            label="Categoria"
            placeholder="Ex: Sobremesa"
            value={field.value ?? ''}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.categoria?.message}
          />
        )}
      />

      <View style={styles.fotoBloco}>
        <Text style={styles.fotoLabel}>Foto</Text>
        {previewUri ? <Image source={{ uri: previewUri }} style={styles.preview} /> : null}
        <Botao
          title={previewUri ? 'Trocar foto' : 'Selecionar foto'}
          variant="outline"
          onPress={selecionarFoto}
        />
      </View>

      <Botao
        title={submitLabel}
        loading={submitting}
        onPress={handleSubmit((dados) => onSubmit(dados, fotoUri))}
        containerStyle={styles.submit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { padding: spacing.lg },
  fotoBloco: { marginBottom: spacing.md, gap: spacing.sm },
  fotoLabel: { fontSize: 13, color: colors.text, fontWeight: '600' },
  preview: { width: '100%', height: 180, borderRadius: radius.md, backgroundColor: colors.border },
  submit: { marginTop: spacing.sm },
});