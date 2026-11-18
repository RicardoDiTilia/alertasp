import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { FonteDadosBanner } from '@/components/fonte-dados-banner';
import { Painel } from '@/components/painel';
import { PontoLinha } from '@/components/ponto-linha';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { TrajetoLinha } from '@/components/trajeto-linha';
import { Spacing, StatusColors } from '@/constants/theme';
import { useRotas } from '@/context/rotas';
import { useSensores } from '@/context/sensores';
import { avaliarRotas } from '@/utils/alertas';
import { formatarDistancia, ROTULO_STATUS } from '@/utils/format';

function descreverSaida(minutos: number, horario: string) {
  if (minutos === 0) return 'Você sai agora.';
  if (minutos < 60) return `Você sai em ${minutos} min.`;
  if (minutos <= 120) return `Você sai em ${Math.floor(minutos / 60)} h ${minutos % 60} min.`;
  return `Saída às ${horario}.`;
}

export default function AlertasScreen() {
  const { pontos, carregando, atualizar } = useSensores();
  const { rotas } = useRotas();

  const avaliacoes = avaliarRotas(rotas, pontos).filter((a) => a.rota.avisar);
  const comRisco = avaliacoes
    .filter((a) => a.pontos.length > 0)
    .sort((a, b) => a.minutosParaSaida - b.minutosParaSaida);
  const semRisco = avaliacoes.filter((a) => a.pontos.length === 0);

  return (
    <Screen titulo="Alertas" comAbas onRefresh={atualizar} refreshing={carregando}>
      <FonteDadosBanner />

      {rotas.length === 0 && (
        <Painel style={styles.vazio}>
          <ThemedText type="heading">Cadastre um trajeto para receber alertas</ThemedText>
          <ThemedText themeColor="textSecondary">
            Você verá aqui os pontos alagados ou em atenção perto do caminho que você faz.
          </ThemedText>
          <Button label="Cadastrar rota" onPress={() => router.push('/rota/form')} />
        </Painel>
      )}

      {rotas.length > 0 && comRisco.length === 0 && (
        <Painel style={styles.vazio}>
          <ThemedText type="heading">✓ Caminhos sem riscos conhecidos</ThemedText>
          <ThemedText themeColor="textSecondary">
            Nenhum ponto em atenção ou alagado perto das suas rotas agora.
          </ThemedText>
        </Painel>
      )}

      {comRisco.map((alerta) => {
        const pior = alerta.pontos[0].ponto.leituraAtual!.status;
        const cores = StatusColors[pior];
        return (
          <Painel key={alerta.rota.id}>
            <View
              style={[styles.faixa, { backgroundColor: cores.background }]}
              accessible
              accessibilityRole="alert"
              accessibilityLabel={`Risco de alagamento na rota ${alerta.rota.nome}, ${alerta.origem.nome} até ${alerta.destino.nome}. Ponto mais grave: ${ROTULO_STATUS[pior]}. ${descreverSaida(alerta.minutosParaSaida, alerta.rota.horarioSaida)}`}>
              <ThemedText type="subtitle" style={{ color: cores.text }}>
                ⚠ {alerta.rota.nome}
              </ThemedText>
              <ThemedText type="smallBold" style={{ color: cores.text }}>
                {descreverSaida(alerta.minutosParaSaida, alerta.rota.horarioSaida)}
                {alerta.saidaProxima ? ' Considere sair mais cedo ou mudar o caminho.' : ''}
              </ThemedText>
            </View>

            <View style={styles.trajeto}>
              <TrajetoLinha
                origem={alerta.origem.nome}
                destino={alerta.destino.nome}
                pontos={alerta.pontos}
              />
            </View>

            {alerta.pontos.map(({ ponto, distanciaM }) => (
              <View key={ponto.id} style={styles.divisoria}>
                <PontoLinha ponto={ponto} detalhe={`A ${formatarDistancia(distanciaM)} do seu caminho`} />
              </View>
            ))}
          </Painel>
        );
      })}

      {comRisco.length > 0 && semRisco.length > 0 && (
        <Painel style={styles.vazio}>
          <ThemedText type="heading">✓ Sem riscos conhecidos</ThemedText>
          {semRisco.map((a) => (
            <ThemedText key={a.rota.id} themeColor="textSecondary">
              {a.rota.nome}: {a.origem.nome} até {a.destino.nome}
            </ThemedText>
          ))}
        </Painel>
      )}

      <ThemedText type="small" themeColor="textSecondary">
        Os alertas mostram riscos conhecidos perto do caminho e não garantem que uma via está livre.
        Em emergência, ligue 199 (Defesa Civil).
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  vazio: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
  faixa: {
    padding: Spacing.three,
    gap: Spacing.one,
  },
  trajeto: {
    padding: Spacing.three,
    paddingTop: Spacing.four,
  },
  divisoria: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#8894',
  },
});
