import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
<<<<<<< HEAD
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AuthProvider, useAuth } from '@/features/auth/context/AuthContext';
=======
>>>>>>> 9314932153d7875381cad1e922d8d1bdcfbb1f54
import { AvisoProvider } from '@/shared/components/AvisoProvider';
import { queryClient } from '@/shared/lib/queryClient';
import { useTheme } from '@/shared/theme';

<<<<<<< HEAD
function Navegacao() {
  const { cores, escuro } = useTheme();
  const { usuario, carregando, ehAdmin, ehGarcom } = useAuth();

  if (carregando) {
    return (
      <View style={[estilos.carregando, { backgroundColor: cores.background }]}>
        <ActivityIndicator color={cores.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: cores.card },
          headerTintColor: cores.text,
          headerTitleStyle: { color: cores.text },
          contentStyle: { backgroundColor: cores.background },
        }}
      >
        <Stack.Protected guard={!usuario}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={Boolean(usuario)}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={Boolean(usuario) && (ehAdmin || ehGarcom)}>
          <Stack.Screen name="mesa/[id]" options={{ title: 'Comanda' }} />
        </Stack.Protected>

        <Stack.Protected guard={Boolean(usuario) && ehAdmin}>
          <Stack.Screen name="produto/novo" options={{ title: 'Novo produto' }} />
          <Stack.Screen name="produto/[id]" options={{ title: 'Editar produto' }} />
          <Stack.Screen name="mesa/nova" options={{ title: 'Nova mesa' }} />
          <Stack.Screen name="mesa/editar/[id]" options={{ title: 'Editar mesa' }} />
        </Stack.Protected>
      </Stack>
      <StatusBar style={escuro ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AvisoProvider>
          <Navegacao />
        </AvisoProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const estilos = StyleSheet.create({
  carregando: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
=======
export default function RootLayout() {
  const { cores, escuro } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <AvisoProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: cores.card },
            headerTintColor: cores.text,
            headerTitleStyle: { color: cores.text },
            contentStyle: { backgroundColor: cores.background },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="produto/novo" options={{ title: 'Novo produto' }} />
          <Stack.Screen name="produto/[id]" options={{ title: 'Editar produto' }} />
          <Stack.Screen name="mesa/[id]" options={{ title: 'Comanda' }} />
          <Stack.Screen name="mesa/nova" options={{ title: 'Nova mesa' }} />
          <Stack.Screen name="mesa/editar/[id]" options={{ title: 'Editar mesa' }} />
        </Stack>
        <StatusBar style={escuro ? 'light' : 'dark'} />
      </AvisoProvider>
    </QueryClientProvider>
  );
}
>>>>>>> 9314932153d7875381cad1e922d8d1bdcfbb1f54
