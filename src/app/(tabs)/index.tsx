import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { FonteDadosBanner } from '@/components/fonte-dados-banner';
import { NivelAoVivo } from '@/components/nivel-ao-vivo';
import { Painel } from '@/components/painel';
import { PontoLinha } from '@/components/ponto-linha';
import { PainelRio, Screen } from '@/components/screen';
import { SensorMap } from '@/components/sensor-map';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useRotas } from '@/context/rotas';
import { useSensores } from '@/context/sensores';
import { useTheme } from '@/hooks/use-theme';
import { GRAVIDADE } from '@/utils/format';

export default function MapaScreen() {
  const { pontos, carregando, atualizar } = useSensores();
  const { rotas } = useRotas();
  const theme = useTheme();

  const pontoIot = pontos.find((p) => p.fonte === 'SENSOR_IOT');
  const ordenados = [...pontos].sort(
    (a, b) =>
      GRAVIDADE[b.leituraAtual?.status ?? 'NORMAL'] - GRAVIDADE[a.leituraAtual?.status ?? 'NORMAL']
  );

  return (
    <Screen
      comAbas
      onRefresh={atualizar}
      refreshing={carregando}
      topo={
        <PainelRio>
          <ThemedText type="title" accessibilityRole="header" style={{ color: theme.onRio }}>
            AlertaSP
          </ThemedText>
          {pontoIot && (
            <Link href={{ pathname: '/sensor/[id]', params: { id: pontoIot.id } }} asChild>
              <Pressable
                accessibilityRole="button"
                accessibilityHint="Abre o histórico deste sensor"
                style={({ pressed }) => [styles.destaque, pressed && styles.pressionado]}>
                <NivelAoVivo ponto={pontoIot} rotulo={`Agora na ${pontoIot.nome}`} />
              </Pressable>
            </Link>
          )}
          <FonteDadosBanner sobreRio />
        </PainelRio>
      }>
      <View style={[styles.mapa, { borderColor: theme.border }]}>
        <SensorMap pontos={pontos} rotas={rotas} />
      </View>

      <ThemedText type="heading" accessibilityRole="header">
        Pontos monitorados
      </ThemedText>
      <Painel divisorias>
        {ordenados.map((ponto) => (
          <PontoLinha key={ponto.id} ponto={ponto} />
        ))}
      </Painel>
    </Screen>
  );
}

const styles = StyleSheet.create({
  destaque: {
    borderRadius: Radius.medium,
  },
  pressionado: {
    opacity: 0.8,
  },
  mapa: {
    borderRadius: Radius.large,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: Spacing.one,
  },
});
