import type { StatusNivel } from '@/types/alerta';

export const ROTULO_STATUS: Record<StatusNivel, string> = {
  NORMAL: 'Normal',
  ATENCAO: 'Atenção',
  ALAGADO: 'Alagado',
};

export const SIMBOLO_STATUS: Record<StatusNivel, string> = {
  NORMAL: '✓',
  ATENCAO: '!',
  ALAGADO: '✕',
};

export const GRAVIDADE: Record<StatusNivel, number> = { NORMAL: 0, ATENCAO: 1, ALAGADO: 2 };

export function formatarHora(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function formatarTempoDesde(iso: string, agora = new Date()): string {
  const minutos = Math.round((agora.getTime() - new Date(iso).getTime()) / 60_000);
  if (minutos < 1) return 'agora mesmo';
  if (minutos < 60) return `há ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas} h`;
  return `em ${new Date(iso).toLocaleDateString('pt-BR')}`;
}

export function formatarDistancia(metros: number): string {
  if (metros < 100) return 'menos de 100 m';
  return metros < 1000 ? `${Math.round(metros / 50) * 50} m` : `${(metros / 1000).toFixed(1)} km`;
}

export function horarioValido(valor: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(valor);
}

export function minutosAte(horario: string, agora = new Date()): number {
  const [h, m] = horario.split(':').map(Number);
  const alvo = h * 60 + m;
  const atual = agora.getHours() * 60 + agora.getMinutes();
  return (alvo - atual + 24 * 60) % (24 * 60);
}
