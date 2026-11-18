import type { SQLiteDatabase } from 'expo-sqlite';

import type { Rota, RotaInput } from '@/types/alerta';

interface LinhaRota {
  id: number;
  nome: string;
  origem_id: string;
  destino_id: string;
  horario_saida: string;
  avisar: number;
}

function paraRota(linha: LinhaRota): Rota {
  return {
    id: linha.id,
    nome: linha.nome,
    origemId: linha.origem_id,
    destinoId: linha.destino_id,
    horarioSaida: linha.horario_saida,
    avisar: linha.avisar === 1,
  };
}

export async function listarRotas(db: SQLiteDatabase): Promise<Rota[]> {
  const linhas = await db.getAllAsync<LinhaRota>('SELECT * FROM rotas ORDER BY horario_saida, nome');
  return linhas.map(paraRota);
}

export async function buscarRota(db: SQLiteDatabase, id: number): Promise<Rota | null> {
  const linha = await db.getFirstAsync<LinhaRota>('SELECT * FROM rotas WHERE id = ?', id);
  return linha ? paraRota(linha) : null;
}

export async function criarRota(db: SQLiteDatabase, rota: RotaInput): Promise<number> {
  const resultado = await db.runAsync(
    'INSERT INTO rotas (nome, origem_id, destino_id, horario_saida, avisar) VALUES (?, ?, ?, ?, ?)',
    rota.nome,
    rota.origemId,
    rota.destinoId,
    rota.horarioSaida,
    rota.avisar ? 1 : 0
  );
  return resultado.lastInsertRowId;
}

export async function atualizarRota(db: SQLiteDatabase, id: number, rota: RotaInput) {
  await db.runAsync(
    'UPDATE rotas SET nome = ?, origem_id = ?, destino_id = ?, horario_saida = ?, avisar = ? WHERE id = ?',
    rota.nome,
    rota.origemId,
    rota.destinoId,
    rota.horarioSaida,
    rota.avisar ? 1 : 0,
    id
  );
}

export async function excluirRota(db: SQLiteDatabase, id: number) {
  await db.runAsync('DELETE FROM rotas WHERE id = ?', id);
}
