import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?:
    | 'default'
    | 'title'
    | 'small'
    | 'smallBold'
    | 'subtitle'
    | 'heading'
    | 'numero'
    | 'link'
    | 'linkPrimary'
    | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return <Text style={[{ color: theme[themeColor ?? 'text'] }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  small: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    lineHeight: 21,
  },
  smallBold: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    lineHeight: 21,
  },
  default: {
    fontFamily: Fonts.medium,
    fontSize: 17,
    lineHeight: 24,
  },
  title: {
    fontFamily: Fonts.condensedBold,
    fontSize: 40,
    lineHeight: 44,
  },
  subtitle: {
    fontFamily: Fonts.condensedBold,
    fontSize: 30,
    lineHeight: 34,
  },
  heading: {
    fontFamily: Fonts.condensedBold,
    fontSize: 22,
    lineHeight: 26,
  },
  numero: {
    fontFamily: Fonts.condensedBold,
    fontSize: 24,
    lineHeight: 28,
  },
  link: {
    fontFamily: Fonts.semibold,
    lineHeight: 30,
    fontSize: 15,
  },
  linkPrimary: {
    fontFamily: Fonts.semibold,
    lineHeight: 30,
    fontSize: 15,
    color: '#0B4F8A',
  },
  code: {
    fontFamily: Fonts.mono,
    fontSize: 12,
  },
});
