import {
  Barlow_400Regular,
  Barlow_500Medium,
  Barlow_600SemiBold,
  Barlow_700Bold,
  useFonts,
} from '@expo-google-fonts/barlow';
import {
  BarlowCondensed_600SemiBold,
  BarlowCondensed_700Bold,
} from '@expo-google-fonts/barlow-condensed';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';
import { RotasProvider } from '@/context/rotas';
import { SensoresProvider } from '@/context/sensores';
import { migrarBanco, NOME_BANCO } from '@/db';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const cores = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const [fontesProntas, erroFontes] = useFonts({
    Barlow_400Regular,
    Barlow_500Medium,
    Barlow_600SemiBold,
    Barlow_700Bold,
    BarlowCondensed_600SemiBold,
    BarlowCondensed_700Bold,
  });

  useEffect(() => {
    if (fontesProntas || erroFontes) SplashScreen.hideAsync();
  }, [fontesProntas, erroFontes]);

  if (!fontesProntas && !erroFontes) return null;

  const base = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const tema = {
    ...base,
    colors: { ...base.colors, background: cores.background, card: cores.background, primary: cores.primary },
  };

  return (
    <ThemeProvider value={tema}>
      <SQLiteProvider databaseName={NOME_BANCO} onInit={migrarBanco}>
        <SensoresProvider>
          <RotasProvider>
            <Stack
              screenOptions={{
                headerShadowVisible: false,
                headerTintColor: cores.primary,
                headerTitleStyle: { fontFamily: Fonts.condensedBold, fontSize: 22, color: cores.text },
              }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="sensor/[id]" options={{ title: 'Ponto monitorado' }} />
              <Stack.Screen name="rota/form" options={{ presentation: 'modal', title: 'Rota' }} />
            </Stack>
          </RotasProvider>
        </SensoresProvider>
      </SQLiteProvider>
    </ThemeProvider>
  );
}
