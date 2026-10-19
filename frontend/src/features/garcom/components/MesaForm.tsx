import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Botao } from '@/shared/components/Botao';
import { Campo } from '@/shared/components/Campo';
import { useTheme, type Cores } from '@/shared/theme';
import { alerta } from '@/shared/utils/dialogos';
import { mesaSchema, type MesaFormData } from '../schemas/mesaSchema';
import type { MesaInput } from '../types/Mesa';

interface MesaFormProps {
  initial?: Partial<MesaInput>;
  submitting?: boolean;
  submitLabel?: string;
  onSubmit: (data: MesaInput) => void;
}

export function MesaForm({ initial, submitting, submitLabel = 'Salvar', onSubmit }: MesaFormProps) {
  const { cores } = useTheme();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);

  const { control, handleSubmit } = useForm<MesaFormData>({
    resolver: zodResolver(mesaSchema),
    defaultValues: {
      numero: initial?.numero ?? '',
      capacidade: initial?.capacidade ?? '',
      ativa: initial?.ativa ?? true,
    },
  });

  const salvar = handleSubmit(
    (data) =>
      onSubmit({
        numero: data.numero.trim(),
        capacidade: data.capacidade?.trim() ?? '',
        ativa: data.ativa,
      }),
    () => alerta('Verifique os campos', 'Corrija os campos destacados e tente novamente.'),
  );

  return (
    <KeyboardAvoidingView style={estilos.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={estilos.flex}
        contentContainerStyle={estilos.form}
        keyboardShouldPersistTaps="handled"
      >
        <Controller
          control={control}
          name="numero"
          render={({ field, fieldState }) => (
            <Campo
              label="Número da mesa"
              placeholder="Ex: 7"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              keyboardType="number-pad"
              erro={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="capacidade"
          render={({ field, fieldState }) => (
            <Campo
              label="Capacidade (opcional)"
              placeholder="Ex: 4"
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
          name="ativa"
          render={({ field }) => (
            <View style={estilos.linhaSwitch}>
              <View style={estilos.textoSwitch}>
                <Text style={estilos.labelSwitch}>Mesa ativa</Text>
                <Text style={estilos.hintSwitch}>
                  {field.value ? 'Pode receber novas comandas' : 'Não aparece para o garçom abrir comanda'}
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

        <Botao title={submitLabel} loading={submitting} onPress={salvar} containerStyle={estilos.submit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const criarEstilos = (c: Cores) =>
  StyleSheet.create({
    flex: { flex: 1 },
    form: { padding: 16, paddingBottom: 40 },
    linhaSwitch: {
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
    textoSwitch: { flex: 1, paddingRight: 12 },
    labelSwitch: { fontSize: 13, color: c.text, fontWeight: '600' },
    hintSwitch: { fontSize: 11, color: c.muted, marginTop: 2 },
    submit: { marginTop: 8 },
  });
