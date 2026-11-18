import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { StatusColors } from '@/constants/theme';
import { localPorId } from '@/data/locais';
import { useTheme } from '@/hooks/use-theme';
import type { PontoMonitorado, Rota } from '@/types/alerta';
import { ROTULO_STATUS } from '@/utils/format';

type Props = {
  pontos: PontoMonitorado[];
  rotas: Rota[];
};

const REGIAO_SAO_PAULO = {
  latitude: -23.555,
  longitude: -46.62,
  latitudeDelta: 0.16,
  longitudeDelta: 0.22,
};

export function SensorMap({ pontos, rotas }: Props) {
  const theme = useTheme();

  return (
    <MapView
      style={styles.mapa}
      initialRegion={REGIAO_SAO_PAULO}
      accessibilityLabel="Mapa com os pontos monitorados. A mesma informação está na lista abaixo.">
      {rotas.map((rota) => {
        const origem = localPorId(rota.origemId);
        const destino = localPorId(rota.destinoId);
        if (!origem || !destino) return null;
        return (
          <Polyline
            key={rota.id}
            coordinates={[
              { latitude: origem.lat, longitude: origem.lng },
              { latitude: destino.lat, longitude: destino.lng },
            ]}
            strokeColor={theme.primary}
            strokeWidth={4}
            lineDashPattern={[12, 8]}
          />
        );
      })}

      {pontos.map((ponto) => {
        const status = ponto.leituraAtual?.status;
        return (
          <Marker
            key={ponto.id}
            coordinate={{ latitude: ponto.lat, longitude: ponto.lng }}
            title={ponto.nome}
            description={
              status
                ? `${ROTULO_STATUS[status]} · ${ponto.leituraAtual!.nivelCm} cm · toque para detalhes`
                : 'Sem dados'
            }
            pinColor={status ? StatusColors[status].pin : '#60646C'}
            onCalloutPress={() =>
              router.push({ pathname: '/sensor/[id]', params: { id: ponto.id } })
            }
          />
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  mapa: {
    width: '100%',
    height: 280,
  },
});
