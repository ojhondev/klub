"use server";

import { revalidatePath } from "next/cache";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { membros, niveis, regrasXp, compras } from "@/db/schema";
import { requireSession } from "@/lib/auth/require-session";
import { resolveNivel } from "@/lib/gamificacao";

const ACOES_VALIDAS = ["compra", "avaliacao", "indicacao", "ugc", "outro"] as const;

export async function createMembroManual(formData: FormData) {
  const session = await requireSession();
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!nome || !email) return;

  const [existente] = await db
    .select({ id: membros.id })
    .from(membros)
    .where(and(eq(membros.lojaId, session.lojaId), eq(membros.email, email)))
    .limit(1);
  if (existente) return;

  const [nivelInicial] = await db
    .select()
    .from(niveis)
    .where(eq(niveis.lojaId, session.lojaId))
    .orderBy(asc(niveis.ordem))
    .limit(1);

  await db.insert(membros).values({
    lojaId: session.lojaId,
    nome,
    email,
    nivelId: nivelInicial?.id ?? null,
  });

  revalidatePath("/membros");
}

export async function registrarAcao(formData: FormData) {
  const session = await requireSession();
  const membroId = String(formData.get("membroId") ?? "");
  const acaoRaw = String(formData.get("acao") ?? "");

  if (!ACOES_VALIDAS.includes(acaoRaw as (typeof ACOES_VALIDAS)[number])) return;
  const acao = acaoRaw as (typeof ACOES_VALIDAS)[number];

  const [membro] = await db
    .select()
    .from(membros)
    .where(and(eq(membros.id, membroId), eq(membros.lojaId, session.lojaId)))
    .limit(1);
  if (!membro) return;

  const [regra] = await db
    .select()
    .from(regrasXp)
    .where(and(eq(regrasXp.lojaId, session.lojaId), eq(regrasXp.acao, acao)))
    .limit(1);

  const xpGanho = regra?.xpValor ?? 0;
  const novoXp = membro.xpTotal + xpGanho;

  const niveisLoja = await db.select().from(niveis).where(eq(niveis.lojaId, session.lojaId));
  const novoNivel = resolveNivel(niveisLoja, novoXp);

  await db
    .update(membros)
    .set({
      xpTotal: novoXp,
      nivelId: novoNivel?.id ?? membro.nivelId,
      ultimaCompraEm: acao === "compra" ? new Date() : membro.ultimaCompraEm,
    })
    .where(eq(membros.id, membroId));

  if (acao === "compra") {
    const valor = Number(formData.get("valor") ?? 0);
    await db.insert(compras).values({
      lojaId: session.lojaId,
      membroId,
      valor: String(Number.isFinite(valor) ? valor : 0),
      origem: "direta",
    });
  }

  revalidatePath(`/membros/${membroId}`);
  revalidatePath("/membros");
  revalidatePath("/dashboard");
}
