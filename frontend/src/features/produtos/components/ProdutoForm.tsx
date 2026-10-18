import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Botao } from '@/shared/components/Botao';
import { Campo } from '@/shared/components/Campo';
import { SeletorChips } from '@/shared/components/SeletorChips';
import { useTheme, type Cores } from '@/shared/theme';
import { alerta } from '@/shared/utils/dialogos';
import { ALERGENICOS, CATEGORIAS } from '../constants';
import { produtoSchema, type ProdutoFormData } from '../schemas/produtoSchema';
import type { ProdutoInput } from '../types/Produto';
import { SeletorFoto } from './SeletorFoto';

interface ProdutoFormProps {
  initial?: Partial<ProdutoInput>;
  fotoAtualUrl?: string | null;
  submitting?: boolean;
  submitLabel?: string;
  onSubmit: (data: ProdutoInput) => void;
}

function separarAlergenicos(valor?: string): string[] {
  if (!valor) return [];
  return valor.split(',').map((i) => i.trim()).filter(Boolean);
}

export function ProdutoForm({
  initial,
  fotoAtualUrl,
  submitting,
  submitLabel = 'Salvar',
  onSubmit,
}: ProdutoFormProps) {
  const { cores } = useTheme();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);

  const { control, handleSubmit } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: initial?.nome ?? '',
      preco: initial?.preco ?? '',
      preco_promocional: initial?.preco_promocional ?? '',
      descricao: initial?.descricao ?? '',
      ingredientes: initial?.ingredientes ?? '',
      alergenicos: initial?.alergenicos ?? '',
      porcao: initial?.porcao ?? '',
      disponivel: initial?.disponivel ?? true,
      promocao_fim: initial?.promocao_fim ?? '',
      categoria: initial?.categoria ?? '',
    },
  });

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
      aspect: [1, 1],
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

  const salvar = handleSubmit(
    (data) =>
      onSubmit({
        nome: data.nome.trim(),
        preco: data.preco.trim(),
        preco_promocional: data.preco_promocional?.trim() ?? '',
        descricao: data.descricao ?? '',
        ingredientes: data.ingredientes ?? '',
        alergenicos: data.alergenicos ?? '',
        porcao: data.porcao ?? '',
        disponivel: data.disponivel,
        promocao_fim: data.promocao_fim ?? '',
        categoria: data.categoria ?? '',
        fotoUri,
        fotoFile,
        fotoName,
        fotoType,
      }),
    () => alerta('Verifique os campos', 'Corrija os campos destacados e tente novamente.'),
  );

  return (
    <KeyboardAvoidingView
      style={estilos.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={estilos.flex}
        contentContainerStyle={estilos.form}
        keyboardShouldPersistTaps="handled"
      >
        <Controller
          control={control}
          name="nome"
          render={({ field, fieldState }) => (
            <Campo
              label="Nome"
              placeholder="Ex: Moqueca Baiana"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              erro={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="preco"
          render={({ field, fieldState }) => (
            <Campo
              label="Preço (R$)"
              placeholder="Ex: 49.90"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              keyboardType="decimal-pad"
              erro={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="preco_promocional"
          render={({ field, fieldState }) => (
            <Campo
              label="Preço promocional (R$, opcional)"
              placeholder="Ex: 39.90"
              value={field.value ?? ''}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              keyboardType="decimal-pad"
              erro={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="categoria"
          render={({ field }) => (
            <SeletorChips
              label="Categoria"
              opcoes={CATEGORIAS}
              selecionados={field.value ? [field.value] : []}
              onToggle={(opcao) => field.onChange(opcao === field.value ? '' : opcao)}
            />
          )}
        />

        <Controller
          control={control}
          name="descricao"
          render={({ field, fieldState }) => (
            <Campo
              label="Descrição"
              placeholder="Ex: Prato típico da Bahia"
              value={field.value ?? ''}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              multiline
              erro={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="ingredientes"
          render={({ field, fieldState }) => (
            <Campo
              label="Ingredientes"
              placeholder="Ex: Peixe, leite de coco, azeite de dendê"
              value={field.value ?? ''}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              multiline
              erro={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="alergenicos"
          render={({ field }) => {
            const selecionados = separarAlergenicos(field.value);
            return (
              <SeletorChips
                label="Alergênicos"
                opcoes={ALERGENICOS}
                selecionados={selecionados}
                onToggle={(opcao) => {
                  const novo = selecionados.includes(opcao)
                    ? selecionados.filter((i) => i !== opcao)
                    : [...selecionados, opcao];
                  field.onChange(novo.join(', '));
                }}
              />
            );
          }}
        />

        <Controller
          control={control}
          name="porcao"
          render={({ field, fieldState }) => (
            <Campo
              label="Porção (serve quantas pessoas)"
              placeholder="Ex: 2"
              value={field.value ?? ''}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              keyboardType="number-pad"
              erro={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="promocao_fim"
          render={({ field, fieldState }) => (
            <Campo
              label="Promoção até (AAAA-MM-DD, opcional)"
              placeholder="Ex: 2026-12-31"
              value={field.value ?? ''}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              erro={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="disponivel"
          render={({ field }) => (
            <View style={estilos.disponibilidade}>
              <View style={estilos.disponibilidadeTexto}>
                <Text style={estilos.disponibilidadeLabel}>Disponível no cardápio</Text>
                <Text style={estilos.disponibilidadeHint}>
                  {field.value ? 'Será exibido como disponível' : 'Será exibido como esgotado'}
                </Text>
              </View>
              <Switch
                value={field.value}
                onValueChange={field.onChange}
                trackColor={{ true: cores.primary, false: cores.border }}
                thumbColor={cores.card}
              />
            </View>
          )}
        />

        <SeletorFoto uri={fotoUri ?? fotoAtualUrl ?? null} onPress={selecionarFoto} />

        <Botao
          title={submitLabel}
          loading={submitting}
          onPress={salvar}
          containerStyle={estilos.submit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const criarEstilos = (c: Cores) =>
  StyleSheet.create({
    flex: { flex: 1 },
    form: { padding: 16, paddingBottom: 40 },
    disponibilidade: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      padding: 12,
    },
    disponibilidadeTexto: { flex: 1, paddingRight: 12 },
    disponibilidadeLabel: { fontSize: 13, color: c.text, fontWeight: '600' },
    disponibilidadeHint: { fontSize: 11, color: c.muted, marginTop: 2 },
    submit: { marginTop: 8 },
  });