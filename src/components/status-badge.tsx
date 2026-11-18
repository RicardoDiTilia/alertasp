import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Radius, Spacing, StatusColors } from '@/constants/theme';
import type { StatusNivel } from '@/types/alerta';
import { ROTULO_STATUS, SIMBOLO_STATUS } from '@/utils/format';

type Props = {
  status: StatusNivel | null;
  size?: 'small' | 'large';
};

export function StatusBadge({ status, size = 'small' }: Props) {
  const grande = size === 'large';

  if (!status) {
    return (
      <View style={[styles.badge, styles.semDados]} accessibilityLabel="Sem dados">
        <Text style={[styles.texto, styles.textoSemDados]}>Sem dados</Text>
      </View>
    );
  }

  const cores = StatusColors[status];
  return (
    <View
      style={[styles.badge, grande && styles.badgeGrande, { backgroundColor: cores.background }]}
      accessible
      accessibilityLabel={`Situação: ${ROTULO_STATUS[status]}`}>
      <Text style={[styles.texto, grande && styles.textoGrande, { color: cores.text }]}>
        {SIMBOLO_STATUS[status]} {ROTULO_STATUS[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.small,
  },
  badgeGrande: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + Spacing.half,
  },
  semDados: {
    backgroundColor: '#4A5D6E',
  },
  texto: {
    fontFamily: Fonts.condensedBold,
    fontSize: 16,
    lineHeight: 20,
  },
  textoGrande: {
    fontSize: 22,
    lineHeight: 26,
  },
  textoSemDados: {
    color: '#ffffff',
  },
});
