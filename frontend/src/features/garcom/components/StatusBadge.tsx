import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme, type Cores } from '@/shared/theme';
import { ROTULO_STATUS, metaStatus } from '../constants';
import type { StatusPedido } from '../types/Pedido';

interface StatusBadgeProps {
  status: StatusPedido;
  compacto?: boolean;
}

/** Etiqueta colorida com o status da comanda. */
export function StatusBadge({ status, compacto }: StatusBadgeProps) {
  const { cores } = useTheme();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);
  const meta = metaStatus(status, cores);

  return (
    <View style={[estilos.badge, compacto && estilos.compacto, { backgroundColor: meta.bg }]}>
      <Text style={[estilos.texto, compacto && estilos.textoCompacto, { color: meta.texto }]}>
        {ROTULO_STATUS[status]}
      </Text>
    </View>
  );
}

const criarEstilos = (c: Cores) =>
  StyleSheet.create({
    badge: { borderRadius: 12, paddingVertical: 4, paddingHorizontal: 10, alignSelf: 'flex-start' },
    compacto: { paddingVertical: 2, paddingHorizontal: 8 },
    texto: { fontSize: 11, fontWeight: '700', color: c.text },
    textoCompacto: { fontSize: 10 },
  });
