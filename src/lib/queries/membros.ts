import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { membros, niveis, compras } from "@/db/schema";

export type FiltroMembros = "todos" | "vip" | "inativos" | "novos" | "recorrentes" | "top";

export type MembroResumo = {
  id: string;
  nome: string;
  email: string;
  xpTotal: number;
  entrouEm: Date;
  ultimaCompraEm: Date | null;
  nivelNome: string | null;
  nivelIcone: string | null;
  nivelOrdem: number | null;
  totalGasto: number;
  totalCompras: number;
};

export async function listMembros(
  lojaId: string,
  filtro: FiltroMembros,
): Promise<MembroResumo[]> {
  const linhas = await db
    .select({
      id: membros.id,
      nome: membros.nome,
      email: membros.email,
      xpTotal: membros.xpTotal,
      entrouEm: membros.entrouEm,
      ultimaCompraEm: membros.ultimaCompraEm,
      nivelNome: niveis.nome,
      nivelIcone: niveis.icone,
      nivelOrdem: niveis.ordem,
    })
    .from(membros)
    .leftJoin(niveis, eq(membros.nivelId, niveis.id))
    .where(eq(membros.lojaId, lojaId));

  const agregados = await db
    .select({
      membroId: compras.membroId,
      totalGasto: sql<number>`coalesce(sum(${compras.valor}), 0)`.mapWith(Number),
      totalCompras: sql<number>`count(*)`.mapWith(Number),
    })
    .from(compras)
    .where(eq(compras.lojaId, lojaId))
    .groupBy(compras.membroId);

  const agregadoPorMembro = new Map(agregados.map((a) => [a.membroId, a]));

  const maiorOrdem = linhas.reduce(
    (max, m) => (m.nivelOrdem !== null && m.nivelOrdem > max ? m.nivelOrdem : max),
    -1,
  );

  const agora = Date.now();
  const ha30 = agora - 30 * 24 * 60 * 60 * 1000;
  const ha90 = agora - 90 * 24 * 60 * 60 * 1000;

  let resultado: MembroResumo[] = linhas.map((m) => {
    const agregado = agregadoPorMembro.get(m.id);
    return {
      ...m,
      totalGasto: agregado?.totalGasto ?? 0,
      totalCompras: agregado?.totalCompras ?? 0,
    };
  });

  switch (filtro) {
    case "vip":
      resultado = resultado.filter(
        (m) => maiorOrdem >= 0 && m.nivelOrdem !== null && m.nivelOrdem === maiorOrdem,
      );
      break;
    case "inativos":
      resultado = resultado.filter(
        (m) => !m.ultimaCompraEm || m.ultimaCompraEm.getTime() < ha90,
      );
      break;
    case "novos":
      resultado = resultado.filter((m) => m.entrouEm.getTime() >= ha30);
      break;
    case "recorrentes":
      resultado = resultado.filter((m) => m.totalCompras >= 2);
      break;
    case "top":
      resultado = [...resultado].sort((a, b) => b.totalGasto - a.totalGasto);
      break;
    default:
      resultado = [...resultado].sort((a, b) => b.entrouEm.getTime() - a.entrouEm.getTime());
  }

  return resultado;
}

export async function getMembro(lojaId: string, membroId: string) {
  const [membro] = await db
    .select({
      id: membros.id,
      nome: membros.nome,
      email: membros.email,
      xpTotal: membros.xpTotal,
      pontosDisponiveis: membros.pontosDisponiveis,
      entrouEm: membros.entrouEm,
      ultimaCompraEm: membros.ultimaCompraEm,
      nivelId: membros.nivelId,
      nivelNome: niveis.nome,
      nivelIcone: niveis.icone,
    })
    .from(membros)
    .leftJoin(niveis, eq(membros.nivelId, niveis.id))
    .where(and(eq(membros.id, membroId), eq(membros.lojaId, lojaId)))
    .limit(1);

  if (!membro) return null;

  const historico = await db
    .select()
    .from(compras)
    .where(eq(compras.membroId, membroId))
    .orderBy(desc(compras.criadoEm));

  return { ...membro, compras: historico };
}
