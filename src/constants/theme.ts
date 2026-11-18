import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0F2233',
    background: '#E9EFF3',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#D5E1EA',
    textSecondary: '#4A5D6E',
    border: '#C9D5DE',
    primary: '#0B4F8A',
    onPrimary: '#FFFFFF',
    danger: '#B42318',
    rio: '#0C2C4A',
    onRio: '#FFFFFF',
    onRioSecondary: '#B8CDE0',
    agua: '#3A9AD9',
    trilha: '#D5E1EA',
  },
  dark: {
    text: '#E8F0F6',
    background: '#08131E',
    backgroundElement: '#112333',
    backgroundSelected: '#1C3448',
    textSecondary: '#9DB2C4',
    border: '#24405A',
    primary: '#6CB4F0',
    onPrimary: '#04182B',
    danger: '#FF8A80',
    rio: '#0C2C4A',
    onRio: '#FFFFFF',
    onRioSecondary: '#B8CDE0',
    agua: '#4FADEB',
    trilha: '#1C3448',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const StatusColors = {
  NORMAL: { background: '#1B6E36', text: '#ffffff', pin: '#1B6E36' },
  ATENCAO: { background: '#F5C518', text: '#1F1600', pin: '#F5A300' },
  ALAGADO: { background: '#B42318', text: '#ffffff', pin: '#D92D20' },
} as const;

export const Fonts = {
  regular: 'Barlow_400Regular',
  medium: 'Barlow_500Medium',
  semibold: 'Barlow_600SemiBold',
  bold: 'Barlow_700Bold',
  condensed: 'BarlowCondensed_600SemiBold',
  condensedBold: 'BarlowCondensed_700Bold',
  mono: Platform.select({ ios: 'ui-monospace', web: 'var(--font-mono)', default: 'monospace' }),
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  small: 6,
  medium: 12,
  large: 20,
} as const;

export const AlturaAbasWeb = 76;

export const BottomTabInset = Platform.select({ ios: 50, android: 80, web: AlturaAbasWeb }) ?? 0;
export const MaxContentWidth = 800;
