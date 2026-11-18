import { JANELA_SAIDA_MINUTOS, RAIO_ALERTA_METROS } from '@/config';
import { localPorId } from '@/data/locais';
import type { Local, PontoMonitorado, Rota } from '@/types/alerta';

import { GRAVIDADE, minutosAte } from './format';
import { projetarNoSegmento } from './geo';

export interface PontoNaRota {
  ponto: PontoMonitorado;
  distanciaM: number;
  posicao: number;
}

export interface AlertaRota {
  rota: Rota;
  origem: Local;
  destino: Local;
  pontos: PontoNaRota[];
  minutosParaSaida: number;
  saidaProxima: boolean;
}

export function avaliarRota(rota: Rota, pontos: PontoMonitorado[], agora = new Date()): AlertaRota | null {
  const origem = localPorId(rota.origemId);
  const destino = localPorId(rota.destinoId);
  if (!origem || !destino) return null;

  const pontosNaRota = pontos
    .filter((p) => p.leituraAtual && p.leituraAtual.status !== 'NORMAL')
    .map((ponto) => ({ ponto, ...projetarNoSegmento(ponto, origem, destino) }))
    .filter((p) => p.distanciaM <= RAIO_ALERTA_METROS)
    .sort(
      (a, b) =>
        GRAVIDADE[b.ponto.leituraAtual!.status] - GRAVIDADE[a.ponto.leituraAtual!.status] ||
        a.distanciaM - b.distanciaM
    );

  const minutosParaSaida = minutosAte(rota.horarioSaida, agora);
  return {
    rota,
    origem,
    destino,
    pontos: pontosNaRota,
    minutosParaSaida,
    saidaProxima: minutosParaSaida <= JANELA_SAIDA_MINUTOS,
  };
}

export function avaliarRotas(rotas: Rota[], pontos: PontoMonitorado[]): AlertaRota[] {
  return rotas
    .map((r) => avaliarRota(r, pontos))
    .filter((a): a is AlertaRota => a !== null);
}
