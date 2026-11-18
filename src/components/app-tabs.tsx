import { NativeTabs } from 'expo-router/native-tabs';
import { Platform, useColorScheme } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';
import { useRotas } from '@/context/rotas';
import { useSensores } from '@/context/sensores';
import { avaliarRotas } from '@/utils/alertas';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { pontos } = useSensores();
  const { rotas } = useRotas();
  const rotasEmRisco = avaliarRotas(rotas, pontos).filter((a) => a.pontos.length > 0).length;

  return (
    <NativeTabs
      backgroundColor={colors.rio}
      indicatorColor={colors.agua}
      labelStyle={{
        fontFamily: Fonts.semibold,
        color: colors.onRioSecondary,
        selected: { color: colors.onRio },
      }}
      iconColor={{
        default: colors.onRioSecondary,
        selected: Platform.OS === 'android' ? '#04182B' : colors.onRio,
      }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Mapa</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="map.fill" md="map" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="rotas">
        <NativeTabs.Trigger.Label>Minhas rotas</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="point.topleft.down.to.point.bottomright.curvepath" md="route" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="alertas">
        <NativeTabs.Trigger.Label>Alertas</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="exclamationmark.triangle.fill" md="warning" />
        {rotasEmRisco > 0 && <NativeTabs.Trigger.Badge>{String(rotasEmRisco)}</NativeTabs.Trigger.Badge>}
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
