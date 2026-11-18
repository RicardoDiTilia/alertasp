import { useSQLiteContext } from 'expo-sqlite';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { INTERVALO_ATUALIZACAO_MS, SENSOR_IOT_ID, THINGSPEAK_RESULTADOS } from '@/config';
import { PONTO_IOT, pontosSimulados } from '@/data/pontos';
import { carregarLeituras, salvarLeituras } from '@/db/leituras';
import {
  buscarLeiturasSensor,
  simularLeiturasSensor,
  thingSpeakConfigurado,
} from '@/services/thingspeak';
import type { Leitura, OrigemDados, PontoMonitorado } from '@/types/alerta';

interface SensoresState {
  pontos: PontoMonitorado[];
  origem: OrigemDados;
  atualizadoEm: string | null;
  carregando: boolean;
  erro: string | null;
  atualizar: () => Promise<void>;
}

const SensoresContext = createContext<SensoresState | null>(null);

function montarPontos(leiturasIot: Leitura[]): PontoMonitorado[] {
  const pontoIot: PontoMonitorado = {
    ...PONTO_IOT,
    leituraAtual: leiturasIot[0] ?? null,
    historico: leiturasIot,
  };
  return [pontoIot, ...pontosSimulados()];
}

export function SensoresProvider({ children }: { children: React.ReactNode }) {
  const db = useSQLiteContext();
  const [leiturasIot, setLeiturasIot] = useState<Leitura[]>([]);
  const [origem, setOrigem] = useState<OrigemDados>(thingSpeakConfigurado ? 'CACHE' : 'DEMO');
  const [atualizadoEm, setAtualizadoEm] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const requisicao = useRef<AbortController | null>(null);

  const atualizar = useCallback(async () => {
    requisicao.current?.abort();
    const controller = new AbortController();
    requisicao.current = controller;
    setCarregando(true);

    try {
      if (!thingSpeakConfigurado) {
        setLeiturasIot(simularLeiturasSensor());
        setOrigem('DEMO');
        setErro(null);
      } else {
        const leituras = await buscarLeiturasSensor(controller.signal);
        await salvarLeituras(db, SENSOR_IOT_ID, leituras);
        setLeiturasIot(leituras);
        setOrigem('THINGSPEAK');
        setErro(null);
      }
      setAtualizadoEm(new Date().toISOString());
    } catch (e) {
      if (controller.signal.aborted) return;
      const cache = await carregarLeituras(db, SENSOR_IOT_ID, THINGSPEAK_RESULTADOS);
      setLeiturasIot(cache);
      setOrigem('CACHE');
      setErro(e instanceof Error ? e.message : 'Falha ao buscar dados do sensor');
    } finally {
      if (requisicao.current === controller) setCarregando(false);
    }
  }, [db]);

  useEffect(() => {
    const inicial = setTimeout(atualizar, 0);
    const id = setInterval(atualizar, INTERVALO_ATUALIZACAO_MS);
    return () => {
      clearTimeout(inicial);
      clearInterval(id);
      requisicao.current?.abort();
    };
  }, [atualizar]);

  const valor = useMemo<SensoresState>(
    () => ({ pontos: montarPontos(leiturasIot), origem, atualizadoEm, carregando, erro, atualizar }),
    [leiturasIot, origem, atualizadoEm, carregando, erro, atualizar]
  );

  return <SensoresContext.Provider value={valor}>{children}</SensoresContext.Provider>;
}

export function useSensores() {
  const ctx = useContext(SensoresContext);
  if (!ctx) throw new Error('useSensores precisa estar dentro de <SensoresProvider>');
  return ctx;
}
