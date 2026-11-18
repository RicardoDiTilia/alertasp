import { StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, StatusColors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { PontoNaRota } from '@/utils/alertas';
import { ROTULO_STATUS, SIMBOLO_STATUS } from '@/utils/format';

type Props = {
  origem: string;
  destino: string;
  pontos: PontoNaRota[];
  cor?: string;
  corTexto?: string;
};

export function TrajetoLinha({ origem, destino, pontos, cor, corTexto }: Props) {
  const theme = useTheme();
  const corLinha = cor ?? theme.primary;
  const resumo =
    pontos.length === 0
      ? 'nenhum ponto de risco no caminho'
      : pontos
          .map((p) => `${p.ponto.nome}, ${ROTULO_STATUS[p.ponto.leituraAtual!.status]}`)
          .join('; ');

  return (
    <View accessible accessibilityLabel={`Trajeto de ${origem} até ${destino}: ${resumo}`}>
      <View style={styles.linhaArea}>
        <View style={[styles.linha, { backgroundColor: corLinha }]} />
        <View style={[styles.ponta, styles.pontaInicio, { borderColor: corLinha, backgroundColor: theme.backgroundElement }]} />
        <View style={[styles.ponta, styles.pontaFim, { borderColor: corLinha, backgroundColor: corLinha }]} />
        {pontos.map(({ ponto, posicao }) => {
          const status = ponto.leituraAtual!.status;
          return (
            <View
              key={ponto.id}
              style={[
                styles.marcador,
                { left: `${6 + posicao * 88}%`, backgroundColor: StatusColors[status].pin },
              ]}>
              <Text style={[styles.simbolo, { color: StatusColors[status].text }]}>
                {SIMBOLO_STATUS[status]}
              </Text>
            </View>
          );
        })}
      </View>
      <View style={styles.nomes}>
        <ThemedText type="smallBold" style={corTexto ? { color: corTexto } : undefined}>
          {origem}
        </ThemedText>
        <ThemedText type="smallBold" style={[styles.destino, corTexto ? { color: corTexto } : undefined]}>
          {destino}
        </ThemedText>
      </View>
    </View>
  );
}

const MARCADOR = 24;

const styles = StyleSheet.create({
  linhaArea: {
    height: MARCADOR + 4,
    justifyContent: 'center',
  },
  linha: {
    height: 4,
    marginHorizontal: 6,
    borderRadius: 2,
  },
  ponta: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
  },
  pontaInicio: {
    left: 0,
  },
  pontaFim: {
    right: 0,
  },
  marcador: {
    position: 'absolute',
    width: MARCADOR,
    height: MARCADOR,
    marginLeft: -MARCADOR / 2,
    borderRadius: MARCADOR / 2,
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  simbolo: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    lineHeight: 16,
  },
  nomes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 2,
  },
  destino: {
    textAlign: 'right',
  },
});
