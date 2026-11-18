import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useSensores } from '@/context/sensores';
import { useTheme } from '@/hooks/use-theme';
import { formatarHora } from '@/utils/format';

const DESCRICAO = {
  THINGSPEAK: 'Sensor conectado',
  CACHE: 'Sem conexão, mostrando a última leitura salva',
  DEMO: 'Modo demonstração, sensor simulado',
} as const;

const COR_INDICADOR = {
  THINGSPEAK: '#3DDC84',
  CACHE: '#F5C518',
  DEMO: '#7DB9F0',
} as const;

export function FonteDadosBanner({ sobreRio = false }: { sobreRio?: boolean }) {
  const { origem, atualizadoEm, carregando } = useSensores();
  const theme = useTheme();
  const hora = atualizadoEm ? `, atualizado às ${formatarHora(atualizadoEm)}` : '';
  const corTexto = sobreRio ? theme.onRioSecondary : theme.textSecondary;

  return (
    <View
      style={styles.linha}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`${DESCRICAO[origem]}${hora}`}
      accessibilityLiveRegion="polite">
      <View style={[styles.indicador, { backgroundColor: COR_INDICADOR[origem] }]} />
      <ThemedText type="small" style={[styles.texto, { color: corTexto }]}>
        {DESCRICAO[origem]}
        {hora}
      </ThemedText>
      {carregando && <ActivityIndicator size="small" color={corTexto} />}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  indicador: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  texto: {
    flex: 1,
  },
});
