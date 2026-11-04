import { useColorScheme } from 'react-native';
import { darkColors, lightColors, radius, spacing, type Cores } from './colors';

export function useTheme() {
  const escuro = useColorScheme() === 'dark';
  const cores: Cores = escuro ? darkColors : lightColors;
  return { cores, escuro, radius, spacing };
}