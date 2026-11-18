import { SENSOR_IOT_ID } from '@/config';
import type { Leitura, PontoMonitorado, StatusNivel } from '@/types/alerta';

type PontoBase = Omit<PontoMonitorado, 'leituraAtual' | 'historico'>;

export const PONTO_IOT: PontoBase = {
  id: SENSOR_IOT_ID,
  nome: 'Marginal Tietê – Ponte das Bandeiras',
  bairro: 'Santana',
  lat: -23.5205,
  lng: -46.6334,
  fonte: 'SENSOR_IOT',
};

const PONTOS_SIMULADOS: (PontoBase & { nivelBaseCm: number; status: StatusNivel })[] = [
  {
    id: 'SP-BANDEIRA-01',
    nome: 'Praça da Bandeira',
    bairro: 'Centro',
    lat: -23.5489,
    lng: -46.6388,
    fonte: 'SIMULADO',
    nivelBaseCm: 34,
    status: 'ATENCAO',
  },
  {
    id: 'SP-ESTADO-01',
    nome: 'Av. do Estado – Mercado Municipal',
    bairro: 'Centro',
    lat: -23.5418,
    lng: -46.6295,
    fonte: 'SIMULADO',
    nivelBaseCm: 58,
    status: 'ALAGADO',
  },
  {
    id: 'SP-ARICANDUVA-01',
    nome: 'Av. Aricanduva',
    bairro: 'Aricanduva',
    lat: -23.5675,
    lng: -46.505,
    fonte: 'SIMULADO',
    nivelBaseCm: 12,
    status: 'NORMAL',
  },
  {
    id: 'SP-SALIM-01',
    nome: 'Av. Salim Farah Maluf',
    bairro: 'Tatuapé',
    lat: -23.553,
    lng: -46.572,
    fonte: 'SIMULADO',
    nivelBaseCm: 8,
    status: 'NORMAL',
  },
  {
    id: 'SP-JAFET-01',
    nome: 'Av. Ricardo Jafet',
    bairro: 'Ipiranga',
    lat: -23.5935,
    lng: -46.617,
    fonte: 'SIMULADO',
    nivelBaseCm: 31,
    status: 'ATENCAO',
  },
  {
    id: 'SP-PINHEIROS-01',
    nome: 'Marginal Pinheiros – Ponte Cidade Jardim',
    bairro: 'Pinheiros',
    lat: -23.5849,
    lng: -46.6935,
    fonte: 'SIMULADO',
    nivelBaseCm: 5,
    status: 'NORMAL',
  },
];

function historicoSimulado(nivelBaseCm: number, status: StatusNivel, agora: Date): Leitura[] {
  return Array.from({ length: 10 }, (_, i) => {
    const fator = 1 - i * 0.08;
    const nivelCm = Math.max(0, Math.round(nivelBaseCm * fator));
    return {
      nivelCm,
      status: i === 0 ? status : statusPorNivel(nivelCm),
      chuvaPct: null,
      timestamp: new Date(agora.getTime() - i * 10 * 60_000).toISOString(),
    };
  });
}

export const LIMITE_ATENCAO_CM = 25;
export const LIMITE_ALAGADO_CM = 50;

export function statusPorNivel(nivelCm: number): StatusNivel {
  if (nivelCm >= LIMITE_ALAGADO_CM) return 'ALAGADO';
  if (nivelCm >= LIMITE_ATENCAO_CM) return 'ATENCAO';
  return 'NORMAL';
}

export function pontosSimulados(agora = new Date()): PontoMonitorado[] {
  return PONTOS_SIMULADOS.map(({ nivelBaseCm, status, ...ponto }) => {
    const historico = historicoSimulado(nivelBaseCm, status, agora);
    return { ...ponto, leituraAtual: historico[0], historico };
  });
}
