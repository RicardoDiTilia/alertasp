import { Children, isValidElement } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function Painel({ children, style, divisorias, ...rest }: ViewProps & { divisorias?: boolean }) {
  const theme = useTheme();
  const filhos = Children.toArray(children).filter(isValidElement);

  return (
    <View style={[styles.painel, { backgroundColor: theme.backgroundElement }, style]} {...rest}>
      {divisorias
        ? filhos.map((filho, i) => (
            <View
              key={filho.key ?? i}
              style={i > 0 && [styles.divisoria, { borderTopColor: theme.border }]}>
              {filho}
            </View>
          ))
        : children}
    </View>
  );
}

const styles = StyleSheet.create({
  painel: {
    borderRadius: Radius.large,
    overflow: 'hidden',
  },
  divisoria: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
