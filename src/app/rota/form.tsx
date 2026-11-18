import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Switch, TextInput, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useRotas } from '@/context/rotas';
import { LOCAIS } from '@/data/locais';
import { buscarRota } from '@/db/rotas';
import { useTheme } from '@/hooks/use-theme';
import { horarioValido } from '@/utils/format';

function fechar() {
  if (router.canGoBack()) router.back();
  else router.replace('/rotas');
}

export default function RotaFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editando = id !== undefined;
  const db = useSQLiteContext();
  const { criar, atualizar } = useRotas();
  const theme = useTheme();

  const [nome, setNome] = useState('');
  const [origemId, setOrigemId] = useState<string | null>(null);
  const [destinoId, setDestinoId] = useState<string | null>(null);
  const [horario, setHorario] = useState('07:30');
  const [avisar, setAvisar] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!editando) return;
    buscarRota(db, Number(id)).then((rota) => {
      if (!rota) return;
      setNome(rota.nome);
      setOrigemId(rota.origemId);
      setDestinoId(rota.destinoId);
      setHorario(rota.horarioSaida);
      setAvisar(rota.avisar);
    });
  }, [db, editando, id]);

  function validar(): string | null {
    if (nome.trim().length < 2) return 'Dê um nome para a rota, por exemplo "Casa → Trabalho".';
    if (!origemId) return 'Escolha o local de saída.';
    if (!destinoId) return 'Escolha o local de destino.';
    if (origemId === destinoId) return 'A saída e o destino precisam ser diferentes.';
    if (!horarioValido(horario)) return 'Informe o horário no formato HH:MM, por exemplo 07:30.';
    return null;
  }

  async function salvar() {
    const mensagem = validar();
    setErro(mensagem);
    if (mensagem) return;

    setSalvando(true);
    const dados = {
      nome: nome.trim(),
      origemId: origemId!,
      destinoId: destinoId!,
      horarioSaida: horario,
      avisar,
    };
    try {
      if (editando) {
        await atualizar(Number(id), dados);
      } else {
        await criar(dados);
      }
      fechar();
    } catch {
      setErro('Não foi possível salvar a rota. Tente novamente.');
      setSalvando(false);
    }
  }

  const estiloInput = [
    styles.input,
    { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundElement },
  ];

  return (
    <Screen>
      <Stack.Screen options={{ title: editando ? 'Editar rota' : 'Nova rota' }} />

      <Campo rotulo="Nome da rota">
        <TextInput
          value={nome}
          onChangeText={setNome}
          placeholder="Ex.: Casa → Trabalho"
          placeholderTextColor={theme.textSecondary}
          style={estiloInput}
          accessibilityLabel="Nome da rota"
          maxLength={40}
        />
      </Campo>

      <Campo rotulo="Saindo de">
        <SeletorLocal selecionado={origemId} onSelecionar={setOrigemId} grupo="Local de saída" />
      </Campo>

      <Campo rotulo="Indo para">
        <SeletorLocal selecionado={destinoId} onSelecionar={setDestinoId} grupo="Local de destino" />
      </Campo>

      <Campo rotulo="Horário de saída (HH:MM)">
        <TextInput
          value={horario}
          onChangeText={setHorario}
          placeholder="07:30"
          placeholderTextColor={theme.textSecondary}
          style={estiloInput}
          keyboardType="numbers-and-punctuation"
          maxLength={5}
          accessibilityLabel="Horário de saída"
          accessibilityHint="Formato horas e minutos, por exemplo 07:30"
        />
      </Campo>

      <View style={styles.linhaSwitch}>
        <ThemedText style={styles.rotuloSwitch}>Avisar sobre riscos nesta rota</ThemedText>
        <Switch
          value={avisar}
          onValueChange={setAvisar}
          accessibilityLabel="Avisar sobre riscos nesta rota"
        />
      </View>

      {erro && (
        <ThemedText
          type="smallBold"
          style={{ color: theme.danger }}
          accessibilityRole="alert"
          accessibilityLiveRegion="assertive">
          {erro}
        </ThemedText>
      )}

      <Button label={salvando ? 'Salvando…' : 'Salvar rota'} onPress={salvar} disabled={salvando} />
      <Button label="Cancelar" variant="secondary" onPress={fechar} />
    </Screen>
  );
}

function Campo({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <View style={styles.campo}>
      <ThemedText type="heading" style={styles.rotuloCampo}>
        {rotulo}
      </ThemedText>
      {children}
    </View>
  );
}

function SeletorLocal({
  selecionado,
  onSelecionar,
  grupo,
}: {
  selecionado: string | null;
  onSelecionar: (id: string) => void;
  grupo: string;
}) {
  const theme = useTheme();
  return (
    <View style={styles.chips} accessibilityRole="radiogroup" accessibilityLabel={grupo}>
      {LOCAIS.map((local) => {
        const ativo = local.id === selecionado;
        return (
          <Pressable
            key={local.id}
            onPress={() => onSelecionar(local.id)}
            accessibilityRole="radio"
            accessibilityState={{ checked: ativo }}
            accessibilityLabel={local.nome}
            style={[
              styles.chip,
              { borderColor: ativo ? theme.primary : theme.border, backgroundColor: theme.backgroundElement },
              ativo && { backgroundColor: theme.primary },
            ]}>
            <ThemedText type="smallBold" style={ativo ? { color: theme.onPrimary } : undefined}>
              {ativo ? '✓ ' : ''}
              {local.nome}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  campo: {
    gap: Spacing.two,
  },
  rotuloCampo: {
    fontSize: 19,
    lineHeight: 22,
  },
  input: {
    minHeight: 52,
    borderWidth: 1.5,
    borderRadius: Radius.medium,
    paddingHorizontal: Spacing.three,
    fontFamily: Fonts.medium,
    fontSize: 17,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.small,
    borderWidth: 1.5,
  },
  linhaSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  rotuloSwitch: {
    flex: 1,
  },
});
