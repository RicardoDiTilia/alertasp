import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { NivelAoVivo } from '@/components/nivel-ao-vivo';
import { Painel } from '@/components/painel';
import { ESCALA_REGUA_CM } from '@/components/regua';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing, StatusColors } from '@/constants/theme';
import { useSensores } from '@/context/sensores';
import { LIMITE_ALAGADO_CM, LIMITE_ATENCAO_CM } from '@/data/pontos';
import { useTheme } from '@/hooks/use-theme';
import { formatarHora, formatarTempoDesde, ROTULO_STATUS } from '@/utils/format';

const ALTURA_GRAFICO = 140;

export default function SensorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pontos, origem, carregando, atualizar } = useSensores();
  const theme = useTheme();
  const ponto = pontos.find((p) => p.id === id);

  if (!ponto) {
    return (
      <Screen>
        <ThemedText>Este ponto não está mais na lista de pontos monitorados.</ThemedText>
      </Screen>
    );
  }

  const leitura = ponto.leituraAtual;
  const ehIot = ponto.fonte === 'SENSOR_IOT';
  const fonte = ehIot
    ? origem === 'DEMO'
      ? 'Sensor ESP32, simulado no app'
      : 'Sensor ESP32 via ThingSpeak'
    : 'Dado simulado para demonstração';
  const historico = ponto.historico.slice(0, 15).reverse();
  const alturaDe = (cm: number) => (Math.min(cm, ESCALA_REGUA_CM) / ESCALA_REGUA_CM) * ALTURA_GRAFICO;

  return (
    <Screen
      onRefresh={atualizar}
      refreshing={carregando}
      topo={
        <View style={[styles.topoDetalhe, { backgroundColor: theme.rio }]}>
          <View style={styles.topoConteudo}>
            <ThemedText type="subtitle" accessibilityRole="header" style={{ color: theme.onRio }}>
              {ponto.nome}
            </ThemedText>
            <ThemedText style={{ color: theme.onRioSecondary }}>{ponto.bairro}</ThemedText>
            <NivelAoVivo ponto={ponto} rotulo="Nível da água agora" />
          </View>
        </View>
      }>
      <Painel divisorias>
        <Info rotulo="Intensidade da chuva" valor={leitura?.chuvaPct != null ? `${leitura.chuvaPct}%` : 'Sem pluviômetro'} />
        <Info
          rotulo="Última leitura"
          valor={leitura ? `${formatarHora(leitura.timestamp)}, ${formatarTempoDesde(leitura.timestamp)}` : 'Sem dados'}
        />
        <Info rotulo="Fonte" valor={fonte} />
      </Painel>

      <ThemedText type="heading" accessibilityRole="header">
        Como a água variou
      </ThemedText>
      <Painel style={styles.graficoPainel}>
        {historico.length === 0 ? (
          <ThemedText themeColor="textSecondary">Ainda não há leituras deste ponto.</ThemedText>
        ) : (
          <>
            <View
              style={styles.grafico}
              accessible
              accessibilityLabel={`Histórico de ${historico.length} leituras: ${historico
                .map((l) => `${formatarHora(l.timestamp)} ${l.nivelCm} centímetros, ${ROTULO_STATUS[l.status]}`)
                .join('; ')}`}>
              {[LIMITE_ATENCAO_CM, LIMITE_ALAGADO_CM].map((cm) => (
                <View key={cm} style={[styles.limite, { bottom: alturaDe(cm), borderColor: theme.textSecondary }]}>
                  <ThemedText style={[styles.limiteTexto, { color: theme.textSecondary, backgroundColor: theme.backgroundElement }]}>
                    {cm === LIMITE_ATENCAO_CM ? '25 atenção' : '50 alagado'}
                  </ThemedText>
                </View>
              ))}
              {historico.map((l) => (
                <View key={l.timestamp} style={styles.coluna}>
                  <View
                    style={[
                      styles.barra,
                      { height: Math.max(2, alturaDe(l.nivelCm)), backgroundColor: StatusColors[l.status].pin },
                    ]}
                  />
                </View>
              ))}
            </View>
            <View style={styles.eixo}>
              <ThemedText type="small" themeColor="textSecondary">
                {formatarHora(historico[0].timestamp)}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                agora
              </ThemedText>
            </View>
          </>
        )}
      </Painel>
    </Screen>
  );
}

function Info({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={styles.info} accessible accessibilityLabel={`${rotulo}: ${valor}`}>
      <ThemedText type="small" themeColor="textSecondary">
        {rotulo}
      </ThemedText>
      <ThemedText type="smallBold" style={styles.infoValor}>
        {valor}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  topoDetalhe: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topoConteudo: {
    gap: Spacing.two,
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  infoValor: {
    flexShrink: 1,
    textAlign: 'right',
    fontSize: 16,
  },
  graficoPainel: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  grafico: {
    height: ALTURA_GRAFICO,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  coluna: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  barra: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  limite: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1,
    borderTopWidth: 1,
    borderStyle: 'dashed',
  },
  limiteTexto: {
    position: 'absolute',
    right: 0,
    top: -9,
    paddingHorizontal: 4,
    fontFamily: Fonts.condensed,
    fontSize: 13,
    lineHeight: 16,
  },
  eixo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
