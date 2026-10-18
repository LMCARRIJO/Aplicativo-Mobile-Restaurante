import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AvisoProvider } from '@/shared/components/AvisoProvider';
import { queryClient } from '@/shared/lib/queryClient';
import { useTheme } from '@/shared/theme';

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
          <Stack.Screen name="index" options={{ title: 'Restaurante Mobile' }} />
          <Stack.Screen name="produto/novo" options={{ title: 'Novo produto' }} />
          <Stack.Screen name="produto/[id]" options={{ title: 'Editar produto' }} />
        </Stack>
        <StatusBar style={escuro ? 'light' : 'dark'} />
      </AvisoProvider>
    </QueryClientProvider>
  );
}