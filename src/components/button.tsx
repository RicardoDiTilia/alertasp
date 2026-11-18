import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  compact?: boolean;
};

export function Button({ label, variant = 'primary', compact, style, disabled, ...rest }: Props) {
  const theme = useTheme();
  const cores = {
    primary: { fundo: theme.primary, texto: theme.onPrimary, borda: theme.primary },
    secondary: { fundo: 'transparent', texto: theme.primary, borda: theme.border },
    danger: { fundo: 'transparent', texto: theme.danger, borda: theme.border },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      style={(state) => [
        styles.botao,
        compact && styles.compacto,
        { backgroundColor: cores.fundo, borderColor: cores.borda },
        (state.pressed || disabled) && styles.atenuado,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}>
      <Text style={[styles.texto, compact && styles.textoCompacto, { color: cores.texto }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    minHeight: 52,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.medium,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compacto: {
    minHeight: 44,
    paddingHorizontal: Spacing.three,
  },
  atenuado: {
    opacity: 0.6,
  },
  texto: {
    fontFamily: Fonts.bold,
    fontSize: 17,
  },
  textoCompacto: {
    fontSize: 15,
  },
});
