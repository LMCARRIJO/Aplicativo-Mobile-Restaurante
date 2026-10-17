import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { queryClient } from '@/shared/lib/queryClient';
import { colors } from '@/shared/theme';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerTintColor: colors.text,
          headerStyle: { backgroundColor: colors.background },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Restaurante' }} />
        <Stack.Screen name="produto/novo" options={{ title: 'Novo produto' }} />
        <Stack.Screen name="produto/[id]" options={{ title: 'Editar produto' }} />
      </Stack>
      <StatusBar style="dark" />
    </QueryClientProvider>
  );
}