import type { SQLiteDatabase } from 'expo-sqlite';

export const NOME_BANCO = 'alertasp.db';

const VERSAO_ATUAL = 1;

export async function migrarBanco(db: SQLiteDatabase) {
  const linha = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let versao = linha?.user_version ?? 0;
  if (versao >= VERSAO_ATUAL) return;

  if (versao === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';

      CREATE TABLE IF NOT EXISTS rotas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        origem_id TEXT NOT NULL,
        destino_id TEXT NOT NULL,
        horario_saida TEXT NOT NULL,
        avisar INTEGER NOT NULL DEFAULT 1,
        criado_em TEXT NOT NULL DEFAULT (datetime('now'))
      );

      -- Cópia local das leituras do sensor IoT, usada quando o app está sem internet.
      CREATE TABLE IF NOT EXISTS leituras_cache (
        sensor_id TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        nivel_cm REAL NOT NULL,
        status TEXT NOT NULL,
        chuva_pct REAL,
        PRIMARY KEY (sensor_id, timestamp)
      );
    `);
    versao = 1;
  }

  await db.execAsync(`PRAGMA user_version = ${VERSAO_ATUAL}`);
}
