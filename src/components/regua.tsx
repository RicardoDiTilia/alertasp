import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, StatusColors } from '@/constants/theme';
import { LIMITE_ALAGADO_CM, LIMITE_ATENCAO_CM } from '@/data/pontos';
import type { StatusNivel } from '@/types/alerta';

export const ESCALA_REGUA_CM = 80;

const pct = (cm: number) => `${Math.min(100, Math.max(0, (cm / ESCALA_REGUA_CM) * 100))}%` as const;

type ReguaProps = {
  nivelCm: number;
  corTrilha: string;
  corAgua: string;
  corMarcas: string;
};

export function ReguaNivel({ nivelCm, corTrilha, corAgua, corMarcas }: ReguaProps) {
  const marcas = Array.from({ length: ESCALA_REGUA_CM / 5 + 1 }, (_, i) => i * 5);

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Régua de nível: ${nivelCm} centímetros. Atenção a partir de ${LIMITE_ATENCAO_CM}, alagado a partir de ${LIMITE_ALAGADO_CM}.`}
      accessibilityValue={{ min: 0, max: ESCALA_REGUA_CM, now: Math.round(nivelCm) }}>
      <View style={[styles.trilha, { backgroundColor: corTrilha }]}>
        <View style={[styles.agua, { width: pct(nivelCm), backgroundColor: corAgua }]} />
        {[LIMITE_ATENCAO_CM, LIMITE_ALAGADO_CM].map((cm) => (
          <View key={cm} style={[styles.limite, { left: pct(cm), borderColor: corMarcas }]} />
        ))}
      </View>

      <View style={styles.marcas}>
        {marcas.map((cm) => (
          <View
            key={cm}
            style={[
              styles.marca,
              { left: pct(cm), backgroundColor: corMarcas, height: cm % 10 === 0 ? 10 : 5 },
            ]}
          />
        ))}
      </View>

      <View style={styles.rotulos}>
        {[0, LIMITE_ATENCAO_CM, LIMITE_ALAGADO_CM, ESCALA_REGUA_CM].map((cm) => (
          <ThemedText
            key={cm}
            style={[
              styles.rotulo,
              { color: corMarcas },
              cm === ESCALA_REGUA_CM ? styles.rotuloFinal : { left: pct(cm) },
            ]}>
            {cm === LIMITE_ATENCAO_CM ? `${cm} atenção` : cm === LIMITE_ALAGADO_CM ? `${cm} alagado` : `${cm} cm`}
          </ThemedText>
        ))}
      </View>
    </View>
  );
}

export function MiniRegua({
  nivelCm,
  status,
  corTrilha,
}: {
  nivelCm: number | null;
  status: StatusNivel | null;
  corTrilha: string;
}) {
  const altura = nivelCm === null ? '0%' : pct(nivelCm);
  return (
    <View style={[styles.mini, { backgroundColor: corTrilha }]} importantForAccessibility="no-hide-descendants">
      <View
        style={[
          styles.miniAgua,
          { height: altura, backgroundColor: status ? StatusColors[status].pin : 'transparent' },
        ]}
      />
      {[LIMITE_ATENCAO_CM, LIMITE_ALAGADO_CM].map((cm) => (
        <View key={cm} style={[styles.miniLimite, { bottom: pct(cm) }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  trilha: {
    height: 28,
    borderRadius: 4,
    overflow: 'hidden',
  },
  agua: {
    height: '100%',
  },
  limite: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderLeftWidth: 2,
    borderStyle: 'dashed',
  },
  marcas: {
    height: 10,
    marginTop: 2,
  },
  marca: {
    position: 'absolute',
    top: 0,
    width: 1,
  },
  rotulos: {
    height: 18,
    marginTop: 2,
  },
  rotulo: {
    position: 'absolute',
    fontFamily: Fonts.condensed,
    fontSize: 13,
    lineHeight: 16,
  },
  rotuloFinal: {
    right: 0,
  },
  mini: {
    width: 10,
    alignSelf: 'stretch',
    minHeight: 48,
    borderRadius: 3,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  miniAgua: {
    width: '100%',
  },
  miniLimite: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#ffffff99',
  },
});
