import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerTintColor: '#111' }}>
        <Stack.Screen name="index" options={{ title: 'Restaurante Mobile' }} />
        <Stack.Screen name="produto/novo" options={{ title: 'Novo produto' }} />
        <Stack.Screen name="produto/[id]" options={{ title: 'Editar produto' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
