import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  titulo?: string;
  subtitulo?: string;
  topo?: React.ReactNode;
  children: React.ReactNode;
  comAbas?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
};

export function Screen({ titulo, subtitulo, topo, children, comAbas, onRefresh, refreshing = false }: Props) {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={titulo && !topo ? ['top'] : []}>
        <ScrollView
          contentContainerStyle={comAbas && { paddingBottom: BottomTabInset + Spacing.four }}
          refreshControl={
            onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined
          }>
          {topo}
          <View style={styles.conteudo}>
            {titulo && (
              <ThemedText type="title" accessibilityRole="header">
                {titulo}
              </ThemedText>
            )}
            {subtitulo && (
              <ThemedText themeColor="textSecondary" style={styles.subtitulo}>
                {subtitulo}
              </ThemedText>
            )}
            {children}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

export function PainelRio({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.painelRio,
        { backgroundColor: theme.rio, paddingTop: insets.top + Spacing.three },
      ]}>
      <View style={styles.painelRioConteudo}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  conteudo: {
    padding: Spacing.three,
    gap: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  subtitulo: {
    marginTop: -Spacing.two,
    maxWidth: 520,
  },
  painelRio: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.four,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  painelRioConteudo: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.three,
  },
});
