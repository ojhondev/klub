"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { niveis, regrasXp } from "@/db/schema";
import { requireSession } from "@/lib/auth/require-session";

const ACOES_VALIDAS = ["compra", "avaliacao", "indicacao", "ugc", "outro"] as const;

export async function createNivel(formData: FormData) {
  const session = await requireSession();
  const nome = String(formData.get("nome") ?? "").trim();
  const icone = String(formData.get("icone") ?? "").trim();
  const xpNecessario = Number(formData.get("xpNecessario") ?? 0);
  const ordem = Number(formData.get("ordem") ?? 0);

  if (!nome) return;

  await db.insert(niveis).values({
    lojaId: session.lojaId,
    nome,
    icone: icone || null,
    xpNecessario: Number.isFinite(xpNecessario) ? xpNecessario : 0,
    ordem: Number.isFinite(ordem) ? ordem : 0,
  });

  revalidatePath("/gamificacao");
}

export async function deleteNivel(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await db.delete(niveis).where(and(eq(niveis.id, id), eq(niveis.lojaId, session.lojaId)));
  revalidatePath("/gamificacao");
}

export async function createRegraXp(formData: FormData) {
  const session = await requireSession();
  const acao = String(formData.get("acao") ?? "");
  const xpValor = Number(formData.get("xpValor") ?? 0);
  const descricao = String(formData.get("descricao") ?? "").trim();

  if (!ACOES_VALIDAS.includes(acao as (typeof ACOES_VALIDAS)[number])) return;

  await db.insert(regrasXp).values({
    lojaId: session.lojaId,
    acao: acao as (typeof ACOES_VALIDAS)[number],
    xpValor: Number.isFinite(xpValor) ? xpValor : 0,
    descricao: descricao || null,
  });

  revalidatePath("/gamificacao");
}

export async function deleteRegraXp(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await db.delete(regrasXp).where(and(eq(regrasXp.id, id), eq(regrasXp.lojaId, session.lojaId)));
  revalidatePath("/gamificacao");
}
