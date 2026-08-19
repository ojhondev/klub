import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { membros, compras, posts, indicacoes } from "@/db/schema";

export type DashboardKpis = {
  membros: number;
  novosMembros: number;
  membrosAtivos: number;
  ltvMembros: number | null;
  taxaRecompra: number | null;
  receitaKlub: number;
  receitaMembros: number;
  pedidosKlub: number;
  indicacoes: number;
  ugcGerado: number;
};

export async function getDashboardKpis(lojaId: string): Promise<DashboardKpis> {
  const agora = new Date();
  const ha30dias = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ha90dias = new Date(agora.getTime() - 90 * 24 * 60 * 60 * 1000);

  const [membrosRow] = await db
    .select({ total: sql<number>`count(*)`.mapWith(Number) })
    .from(membros)
    .where(eq(membros.lojaId, lojaId));

  const [novosRow] = await db
    .select({ total: sql<number>`count(*)`.mapWith(Number) })
    .from(membros)
    .where(and(eq(membros.lojaId, lojaId), gte(membros.entrouEm, ha30dias)));

  const [ativosRow] = await db
    .select({ total: sql<number>`count(*)`.mapWith(Number) })
    .from(membros)
    .where(and(eq(membros.lojaId, lojaId), gte(membros.ultimaCompraEm, ha90dias)));

  const [receitaRow] = await db
    .select({
      total: sql<number>`coalesce(sum(${compras.valor}), 0)`.mapWith(Number),
      pedidos: sql<number>`count(*)`.mapWith(Number),
    })
    .from(compras)
    .where(eq(compras.lojaId, lojaId));

  const [receitaKlubRow] = await db
    .select({
      total: sql<number>`coalesce(sum(${compras.valor}), 0)`.mapWith(Number),
      pedidos: sql<number>`count(*)`.mapWith(Number),
    })
    .from(compras)
    .where(and(eq(compras.lojaId, lojaId), eq(compras.origem, "klub")));

  const comprasPorMembro = await db
    .select({
      membroId: compras.membroId,
      qtd: sql<number>`count(*)`.mapWith(Number),
    })
    .from(compras)
    .where(eq(compras.lojaId, lojaId))
    .groupBy(compras.membroId);

  const compradores = comprasPorMembro.length;
  const recompradores = comprasPorMembro.filter((c) => c.qtd >= 2).length;
  const taxaRecompra = compradores > 0 ? Math.round((recompradores / compradores) * 100) : null;

  const [postsRow] = await db
    .select({ total: sql<number>`count(*)`.mapWith(Number) })
    .from(posts)
    .where(eq(posts.lojaId, lojaId));

  const [indicacoesRow] = await db
    .select({ total: sql<number>`count(*)`.mapWith(Number) })
    .from(indicacoes)
    .innerJoin(membros, eq(indicacoes.membroIndicadorId, membros.id))
    .where(eq(membros.lojaId, lojaId));

  return {
    membros: membrosRow.total,
    novosMembros: novosRow.total,
    membrosAtivos: ativosRow.total,
    ltvMembros: membrosRow.total > 0 ? receitaRow.total / membrosRow.total : null,
    taxaRecompra,
    receitaKlub: receitaKlubRow.total,
    receitaMembros: receitaRow.total,
    pedidosKlub: receitaKlubRow.pedidos,
    indicacoes: indicacoesRow.total,
    ugcGerado: postsRow.total,
  };
}
