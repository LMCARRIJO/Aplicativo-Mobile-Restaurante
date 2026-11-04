import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Botao } from '@/shared/components/Botao';
import { Campo } from '@/shared/components/Campo';
import { mensagemErro } from '@/shared/lib/http';
import { useTheme, type Cores } from '@/shared/theme';
import { useAuth } from '../context/AuthContext';
import { loginSchema, type LoginFormData } from '../schemas/loginSchema';

export default function LoginScreen() {
  const { cores } = useTheme();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);
  const { entrar } = useAuth();
  const [erro, setErro] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const submeter = handleSubmit(async (dados) => {
    setErro(null);
    try {
      await entrar(dados.email.trim(), dados.password);
    } catch (e) {
      setErro(mensagemErro(e));
    }
  });

  return (
    <KeyboardAvoidingView
      style={estilos.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={estilos.flex}
        contentContainerStyle={estilos.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <View style={estilos.marca}>
          <Text style={estilos.logo}>Restaurante</Text>
          <Text style={estilos.subtitulo}>Entre com sua conta da equipe</Text>
        </View>

        <View style={estilos.card}>
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <Campo
                label="E-mail"
                placeholder="voce@restaurante.test"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                erro={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <Campo
                label="Senha"
                placeholder="Sua senha"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="current-password"
                textContentType="password"
                erro={fieldState.error?.message}
              />
            )}
          />

          {erro ? <Text style={estilos.erro}>{erro}</Text> : null}

          <Botao
            title="Entrar"
            loading={isSubmitting}
            onPress={() => void submeter()}
            containerStyle={estilos.botao}
          />
        </View>

        <Text style={estilos.rodape}>Acesso restrito à equipe do restaurante.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const criarEstilos = (c: Cores) =>
  StyleSheet.create({
    flex: { flex: 1, backgroundColor: c.background },
    conteudo: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 24,
      gap: 20,
    },
    marca: { alignItems: 'center', gap: 6 },
    logo: { fontSize: 30, fontWeight: '800', color: c.primary },
    subtitulo: { fontSize: 14, color: c.muted },
    card: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 16,
      padding: 16,
    },
    erro: {
      color: c.danger,
      fontSize: 13,
      marginBottom: 12,
      textAlign: 'center',
    },
    botao: { marginTop: 4 },
    rodape: { textAlign: 'center', fontSize: 12, color: c.muted },
  });
