export type StatusNivel = 'NORMAL' | 'ATENCAO' | 'ALAGADO';

export type FonteDado = 'SENSOR_IOT' | 'SIMULADO';

export type OrigemDados = 'THINGSPEAK' | 'CACHE' | 'DEMO';

export interface Leitura {
  nivelCm: number;
  status: StatusNivel;
  chuvaPct: number | null;
  timestamp: string;
}

export interface PontoMonitorado {
  id: string;
  nome: string;
  bairro: string;
  lat: number;
  lng: number;
  fonte: FonteDado;
  leituraAtual: Leitura | null;
  historico: Leitura[];
}

export interface Local {
  id: string;
  nome: string;
  lat: number;
  lng: number;
}

export interface Rota {
  id: number;
  nome: string;
  origemId: string;
  destinoId: string;
  horarioSaida: string;
  avisar: boolean;
}

export type RotaInput = Omit<Rota, 'id'>;
