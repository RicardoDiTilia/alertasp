import { THINGSPEAK_CHANNEL_ID, THINGSPEAK_READ_API_KEY, THINGSPEAK_RESULTADOS } from '@/config';
import { statusPorNivel } from '@/data/pontos';
import type { Leitura, StatusNivel } from '@/types/alerta';

interface FeedThingSpeak {
  created_at: string;
  field1: string | null;
  field2: string | null;
  field3: string | null;
}

interface RespostaThingSpeak {
  feeds: FeedThingSpeak[];
}

const STATUS_POR_CODIGO: StatusNivel[] = ['NORMAL', 'ATENCAO', 'ALAGADO'];

export const thingSpeakConfigurado = THINGSPEAK_CHANNEL_ID.trim() !== '';

function paraLeitura(feed: FeedThingSpeak): Leitura | null {
  const nivelCm = Number(feed.field1);
  if (feed.field1 === null || Number.isNaN(nivelCm)) return null;

  const codigo = Number(feed.field2);
  const chuva = Number(feed.field3);
  return {
    nivelCm,
    status: STATUS_POR_CODIGO[codigo] ?? statusPorNivel(nivelCm),
    chuvaPct: feed.field3 === null || Number.isNaN(chuva) ? null : chuva,
    timestamp: feed.created_at,
  };
}

export async function buscarLeiturasSensor(signal?: AbortSignal): Promise<Leitura[]> {
  const params = new URLSearchParams({ results: String(THINGSPEAK_RESULTADOS) });
  if (THINGSPEAK_READ_API_KEY) params.set('api_key', THINGSPEAK_READ_API_KEY);

  const url = `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json?${params}`;
  const resposta = await fetch(url, { signal });
  if (!resposta.ok) {
    throw new Error(`ThingSpeak respondeu ${resposta.status}`);
  }

  const dados = (await resposta.json()) as RespostaThingSpeak;
  return dados.feeds
    .map(paraLeitura)
    .filter((l): l is Leitura => l !== null)
    .reverse();
}

export function simularLeiturasSensor(agora = new Date()): Leitura[] {
  const PASSO_MS = 20_000;
  const CICLO_MS = 6 * 60_000;
  return Array.from({ length: THINGSPEAK_RESULTADOS }, (_, i) => {
    const instante = agora.getTime() - i * PASSO_MS;
    const fase = ((instante % CICLO_MS) / CICLO_MS) * 2 * Math.PI;
    const nivelCm = Math.round(32 + 30 * Math.sin(fase));
    return {
      nivelCm,
      status: statusPorNivel(nivelCm),
      chuvaPct: Math.round(50 + 45 * Math.sin(fase + 0.6)),
      timestamp: new Date(instante).toISOString(),
    };
  });
}
