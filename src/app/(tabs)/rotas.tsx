import { router } from 'expo-router';
import { Alert, Platform, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Painel } from '@/components/painel';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { TrajetoLinha } from '@/components/trajeto-linha';
import { Spacing, StatusColors } from '@/constants/theme';
import { useRotas } from '@/context/rotas';
import { useSensores } from '@/context/sensores';
import type { Rota } from '@/types/alerta';
import { avaliarRota } from '@/utils/alertas';

export default function RotasScreen() {
  const { rotas, carregando, excluir } = useRotas();
  const { pontos } = useSensores();

  function confirmarExclusao(rota: Rota) {
    const mensagem = `Excluir a rota "${rota.nome}"? Ela deixa de gerar alertas.`;

    if (Platform.OS === 'web') {
      if (window.confirm(mensagem)) excluir(rota.id);
      return;
    }

    Alert.alert('Excluir rota', mensagem, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => excluir(rota.id) },
    ]);
  }

  return (
    <Screen
      titulo="Minhas rotas"
      subtitulo="Os trajetos que você faz no dia a dia. Os alertas mostram só o que pode atrapalhar esses caminhos."
      comAbas>
      <Button
        label="Cadastrar rota"
        onPress={() => router.push('/rota/form')}
        accessibilityHint="Abre o formulário para cadastrar um trajeto"
      />

      {!carregando && rotas.length === 0 && (
        <Painel style={styles.vazio}>
          <ThemedText type="heading">Nenhuma rota ainda</ThemedText>
          <ThemedText themeColor="textSecondary">
            Comece pelo caminho de casa até o trabalho ou a faculdade. Você escolhe os bairros; o app
            não usa sua localização.
          </ThemedText>
        </Painel>
      )}

      {rotas.map((rota) => {
        const avaliacao = avaliarRota(rota, pontos);
        if (!avaliacao) return null;
        const qtd = avaliacao.pontos.length;
        const pior = avaliacao.pontos[0]?.ponto.leituraAtual?.status;

        return (
          <Painel key={rota.id} style={styles.rota}>
            <View style={styles.cabecalho}>
              <ThemedText type="heading" style={styles.nome}>
                {rota.nome}
              </ThemedText>
              <ThemedText type="numero" themeColor="textSecondary" accessibilityLabel={`Saída às ${rota.horarioSaida}`}>
                {rota.horarioSaida}
              </ThemedText>
            </View>

            <TrajetoLinha
              origem={avaliacao.origem.nome}
              destino={avaliacao.destino.nome}
              pontos={avaliacao.pontos}
            />

            <ThemedText
              type="smallBold"
              style={pior ? { color: StatusColors[pior].pin } : undefined}
              themeColor={pior ? undefined : 'textSecondary'}>
              {qtd === 0
                ? '✓ Nenhum ponto de risco no caminho'
                : `${qtd} ${qtd === 1 ? 'ponto de risco' : 'pontos de risco'} no caminho`}
              {rota.avisar ? '' : ' (avisos desligados)'}
            </ThemedText>

            <View style={styles.acoes}>
              <Button
                label="Editar"
                variant="secondary"
                compact
                style={styles.acao}
                accessibilityLabel={`Editar rota ${rota.nome}`}
                onPress={() =>
                  router.push({ pathname: '/rota/form', params: { id: String(rota.id) } })
                }
              />
              <Button
                label="Excluir"
                variant="danger"
                compact
                style={styles.acao}
                accessibilityLabel={`Excluir rota ${rota.nome}`}
                onPress={() => confirmarExclusao(rota)}
              />
            </View>
          </Painel>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  vazio: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
  rota: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  nome: {
    flex: 1,
  },
  acoes: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  acao: {
    flex: 1,
  },
});
