import { useSQLiteContext } from 'expo-sqlite';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import * as repo from '@/db/rotas';
import type { Rota, RotaInput } from '@/types/alerta';

interface RotasState {
  rotas: Rota[];
  carregando: boolean;
  criar: (rota: RotaInput) => Promise<void>;
  atualizar: (id: number, rota: RotaInput) => Promise<void>;
  excluir: (id: number) => Promise<void>;
}

const RotasContext = createContext<RotasState | null>(null);

export function RotasProvider({ children }: { children: React.ReactNode }) {
  const db = useSQLiteContext();
  const [rotas, setRotas] = useState<Rota[]>([]);
  const [carregando, setCarregando] = useState(true);

  const recarregar = useCallback(async () => {
    setRotas(await repo.listarRotas(db));
    setCarregando(false);
  }, [db]);

  useEffect(() => {
    let ativo = true;
    repo.listarRotas(db).then((lista) => {
      if (!ativo) return;
      setRotas(lista);
      setCarregando(false);
    });
    return () => {
      ativo = false;
    };
  }, [db]);

  const valor = useMemo<RotasState>(
    () => ({
      rotas,
      carregando,
      criar: async (rota) => {
        await repo.criarRota(db, rota);
        await recarregar();
      },
      atualizar: async (id, rota) => {
        await repo.atualizarRota(db, id, rota);
        await recarregar();
      },
      excluir: async (id) => {
        await repo.excluirRota(db, id);
        await recarregar();
      },
    }),
    [rotas, carregando, db, recarregar]
  );

  return <RotasContext.Provider value={valor}>{children}</RotasContext.Provider>;
}

export function useRotas() {
  const ctx = useContext(RotasContext);
  if (!ctx) throw new Error('useRotas precisa estar dentro de <RotasProvider>');
  return ctx;
}
