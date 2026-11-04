import { Tabs } from 'expo-router';
<<<<<<< HEAD
import { Pressable, Text } from 'react-native';
import { useAuth } from '@/features/auth/context/AuthContext';
=======
import { Text } from 'react-native';
>>>>>>> 9314932153d7875381cad1e922d8d1bdcfbb1f54
import { useTheme } from '@/shared/theme';

export default function TabsLayout() {
  const { cores } = useTheme();
<<<<<<< HEAD
  const { ehAdmin, ehGarcom, ehCozinha, sair } = useAuth();

  const podeMesas = ehAdmin || ehGarcom;
  const podeCozinha = ehAdmin || ehCozinha;
  const podeCardapio = ehAdmin || ehGarcom;
=======
>>>>>>> 9314932153d7875381cad1e922d8d1bdcfbb1f54

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: cores.card },
        headerTintColor: cores.text,
        headerTitleStyle: { color: cores.text },
        tabBarStyle: { backgroundColor: cores.card, borderTopColor: cores.border },
        tabBarActiveTintColor: cores.primary,
        tabBarInactiveTintColor: cores.muted,
<<<<<<< HEAD
        headerRight: () => (
          <Pressable onPress={() => void sair()} hitSlop={10} style={{ paddingHorizontal: 16 }}>
            <Text style={{ color: cores.primary, fontWeight: '700', fontSize: 13 }}>Sair</Text>
          </Pressable>
        ),
      }}
    >
      <Tabs.Protected guard={podeMesas}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Mesas',
            tabBarIcon: ({ size }) => <Text style={{ fontSize: size ?? 18 }}>🍽️</Text>,
          }}
        />
      </Tabs.Protected>

      <Tabs.Protected guard={podeCozinha}>
        <Tabs.Screen
          name="cozinha"
          options={{
            title: 'Cozinha',
            tabBarIcon: ({ size }) => <Text style={{ fontSize: size ?? 18 }}>👨‍🍳</Text>,
          }}
        />
      </Tabs.Protected>

      <Tabs.Protected guard={podeCardapio}>
        <Tabs.Screen
          name="cardapio"
          options={{
            title: 'Cardápio',
            tabBarIcon: ({ size }) => <Text style={{ fontSize: size ?? 18 }}>📖</Text>,
          }}
        />
      </Tabs.Protected>
=======
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
>>>>>>> 9314932153d7875381cad1e922d8d1bdcfbb1f54
    </Tabs>
  );
}
