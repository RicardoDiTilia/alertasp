import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AlturaAbasWeb, Colors, Fonts, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useRotas } from '@/context/rotas';
import { useSensores } from '@/context/sensores';
import { avaliarRotas } from '@/utils/alertas';

const cores = Colors.light;

export default function AppTabs() {
  const { pontos } = useSensores();
  const { rotas } = useRotas();
  const rotasEmRisco = avaliarRotas(rotas, pontos).filter(
    (a) => a.rota.avisar && a.pontos.length > 0
  ).length;

  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <BarraAbas>
          <TabTrigger name="index" href="/" asChild>
            <TabButton>Mapa</TabButton>
          </TabTrigger>
          <TabTrigger name="rotas" href="/rotas" asChild>
            <TabButton>Minhas rotas</TabButton>
          </TabTrigger>
          <TabTrigger name="alertas" href="/alertas" asChild>
            <TabButton contador={rotasEmRisco}>Alertas</TabButton>
          </TabTrigger>
        </BarraAbas>
      </TabList>
    </Tabs>
  );
}

export function TabButton({
  children,
  isFocused,
  contador = 0,
  ref: _ref,
  ...props
}: TabTriggerSlotProps & { contador?: number }) {
  const rotulo = contador > 0 ? `${children}, ${contador} ${contador === 1 ? 'rota' : 'rotas'} em risco` : children;
  return (
    <Pressable
      {...props}
      accessibilityLabel={typeof rotulo === 'string' ? rotulo : undefined}
      style={({ pressed }) => [styles.aba, isFocused && styles.abaAtiva, pressed && styles.pressionado]}>
      <Text style={[styles.texto, isFocused && styles.textoAtivo]}>{children}</Text>
      {contador > 0 && (
        <View style={styles.contador}>
          <Text style={styles.contadorTexto}>{contador}</Text>
        </View>
      )}
    </Pressable>
  );
}

export function BarraAbas(props: TabListProps) {
  return (
    <View {...props} style={styles.barra}>
      <View style={styles.conteudo}>{props.children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: AlturaAbasWeb,
    backgroundColor: cores.rio,
    borderTopLeftRadius: Radius.large,
    borderTopRightRadius: Radius.large,
    paddingHorizontal: Spacing.two,
    justifyContent: 'center',
  },
  conteudo: {
    flexDirection: 'row',
    gap: Spacing.one,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  aba: {
    flex: 1,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one + Spacing.half,
    borderRadius: Radius.medium,
  },
  abaAtiva: {
    backgroundColor: cores.agua,
  },
  pressionado: {
    opacity: 0.7,
  },
  texto: {
    fontFamily: Fonts.semibold,
    fontSize: 16,
    color: cores.onRioSecondary,
  },
  textoAtivo: {
    fontFamily: Fonts.bold,
    color: '#04182B',
  },
  contador: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    backgroundColor: '#D92D20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contadorTexto: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: '#ffffff',
  },
});
