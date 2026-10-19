import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useTheme } from '@/shared/theme';

export default function TabsLayout() {
  const { cores } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: cores.card },
        headerTintColor: cores.text,
        headerTitleStyle: { color: cores.text },
        tabBarStyle: { backgroundColor: cores.card, borderTopColor: cores.border },
        tabBarActiveTintColor: cores.primary,
        tabBarInactiveTintColor: cores.muted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Mesas',
          tabBarIcon: ({ size }) => <Text style={{ fontSize: size ?? 18 }}>🍽️</Text>,
        }}
      />
      <Tabs.Screen
        name="cozinha"
        options={{
          title: 'Cozinha',
          tabBarIcon: ({ size }) => <Text style={{ fontSize: size ?? 18 }}>🍳</Text>,
        }}
      />
      <Tabs.Screen
        name="cardapio"
        options={{
          title: 'Cardápio',
          tabBarIcon: ({ size }) => <Text style={{ fontSize: size ?? 18 }}>📋</Text>,
        }}
      />
    </Tabs>
  );
}
