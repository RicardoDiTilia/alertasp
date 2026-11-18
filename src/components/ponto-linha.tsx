import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { MiniRegua } from '@/components/regua';
import { StatusBadge } from '@/components/status-badge';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { PontoMonitorado } from '@/types/alerta';
import { formatarTempoDesde, ROTULO_STATUS } from '@/utils/format';

type Props = {
  ponto: PontoMonitorado;
  detalhe?: string;
};

export function PontoLinha({ ponto, detalhe }: Props) {
  const theme = useTheme();
  const leitura = ponto.leituraAtual;
  const ehIot = ponto.fonte === 'SENSOR_IOT';
  const origem = ehIot ? 'sensor IoT' : 'dado simulado';
  const resumo = leitura
    ? `${ponto.nome}, ${ROTULO_STATUS[leitura.status]}, ${leitura.nivelCm} centímetros, ${origem}`
    : `${ponto.nome}, sem dados`;

  return (
    <Link href={{ pathname: '/sensor/[id]', params: { id: ponto.id } }} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={detalhe ? `${resumo}, ${detalhe}` : resumo}
        accessibilityHint="Abre os detalhes do ponto">
        {({ pressed }) => (
          <View style={[styles.linha, pressed && { backgroundColor: theme.backgroundSelected }]}>
            <MiniRegua
              nivelCm={leitura?.nivelCm ?? null}
              status={leitura?.status ?? null}
              corTrilha={theme.trilha}
            />
            <View style={styles.textos}>
              <ThemedText type="smallBold" style={styles.nome}>
                {ponto.nome}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {ponto.bairro}, {origem}
                {leitura ? `, ${formatarTempoDesde(leitura.timestamp)}` : ''}
              </ThemedText>
              {detalhe && (
                <ThemedText type="smallBold" themeColor="primary">
                  {detalhe}
                </ThemedText>
              )}
            </View>
            <View style={styles.medida}>
              <ThemedText type="numero">{leitura ? `${leitura.nivelCm} cm` : '—'}</ThemedText>
              <StatusBadge status={leitura?.status ?? null} />
            </View>
          </View>
        )}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  textos: {
    flex: 1,
    gap: Spacing.half,
    justifyContent: 'center',
  },
  nome: {
    fontSize: 17,
    lineHeight: 22,
  },
  medida: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: Spacing.one,
  },
});
