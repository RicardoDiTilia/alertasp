import type { SQLiteDatabase } from 'expo-sqlite';

import type { Leitura, StatusNivel } from '@/types/alerta';

const LIMITE_POR_SENSOR = 50;

interface LinhaLeitura {
  timestamp: string;
  nivel_cm: number;
  status: StatusNivel;
  chuva_pct: number | null;
}

export async function salvarLeituras(db: SQLiteDatabase, sensorId: string, leituras: Leitura[]) {
  await db.withTransactionAsync(async () => {
    for (const l of leituras) {
      await db.runAsync(
        `INSERT OR REPLACE INTO leituras_cache (sensor_id, timestamp, nivel_cm, status, chuva_pct)
         VALUES (?, ?, ?, ?, ?)`,
        sensorId,
        l.timestamp,
        l.nivelCm,
        l.status,
        l.chuvaPct
      );
    }
    await db.runAsync(
      `DELETE FROM leituras_cache WHERE sensor_id = ? AND timestamp NOT IN (
         SELECT timestamp FROM leituras_cache WHERE sensor_id = ? ORDER BY timestamp DESC LIMIT ?
       )`,
      sensorId,
      sensorId,
      LIMITE_POR_SENSOR
    );
  });
}

export async function carregarLeituras(
  db: SQLiteDatabase,
  sensorId: string,
  limite: number
): Promise<Leitura[]> {
  const linhas = await db.getAllAsync<LinhaLeitura>(
    'SELECT timestamp, nivel_cm, status, chuva_pct FROM leituras_cache WHERE sensor_id = ? ORDER BY timestamp DESC LIMIT ?',
    sensorId,
    limite
  );
  return linhas.map((l) => ({
    nivelCm: l.nivel_cm,
    status: l.status,
    chuvaPct: l.chuva_pct,
    timestamp: l.timestamp,
  }));
}
