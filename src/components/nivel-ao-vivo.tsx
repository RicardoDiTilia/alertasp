import { StyleSheet, View } from 'react-native';

import { ReguaNivel } from '@/components/regua';
import { StatusBadge } from '@/components/status-badge';
import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { PontoMonitorado } from '@/types/alerta';

export function NivelAoVivo({ ponto, rotulo }: { ponto: PontoMonitorado; rotulo: string }) {
  const theme = useTheme();
  const leitura = ponto.leituraAtual;

  return (
    <View style={styles.bloco}>
      <ThemedText type="small" style={{ color: theme.onRioSecondary }}>
        {rotulo}
      </ThemedText>
      <View style={styles.linhaNumero}>
        <ThemedText style={[styles.numero, { color: theme.onRio }]} accessibilityLabel={leitura ? `${leitura.nivelCm} centímetros de água` : 'Sem dados'}>
          {leitura ? leitura.nivelCm : '—'}
          <ThemedText style={[styles.unidade, { color: theme.onRioSecondary }]}> cm de água</ThemedText>
        </ThemedText>
        <StatusBadge status={leitura?.status ?? null} size="large" />
      </View>
      <ReguaNivel
        nivelCm={leitura?.nivelCm ?? 0}
        corTrilha="#ffffff1f"
        corAgua={theme.agua}
        corMarcas={theme.onRioSecondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bloco: {
    gap: Spacing.two,
  },
  linhaNumero: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.three,
    flexWrap: 'wrap',
  },
  numero: {
    fontFamily: Fonts.condensedBold,
    fontSize: 72,
    lineHeight: 74,
  },
  unidade: {
    fontFamily: Fonts.condensed,
    fontSize: 22,
    lineHeight: 26,
  },
});
