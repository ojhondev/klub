"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { beneficios } from "@/db/schema";
import { requireSession } from "@/lib/auth/require-session";

const TIPOS_VALIDOS = [
  "cupom",
  "cashback",
  "frete_gratis",
  "brinde",
  "desconto",
  "produto_exclusivo",
  "acesso_antecipado",
] as const;

export async function createBeneficio(formData: FormData) {
  const session = await requireSession();
  const tipo = String(formData.get("tipo") ?? "");
  const nome = String(formData.get("nome") ?? "").trim();
  const valor = String(formData.get("valor") ?? "").trim();
  const nivelId = String(formData.get("nivelId") ?? "");

  if (!nome || !TIPOS_VALIDOS.includes(tipo as (typeof TIPOS_VALIDOS)[number])) return;

  await db.insert(beneficios).values({
    lojaId: session.lojaId,
    tipo: tipo as (typeof TIPOS_VALIDOS)[number],
    nome,
    valor: valor || null,
    nivelId: nivelId || null,
  });

  revalidatePath("/beneficios");
}

export async function deleteBeneficio(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await db
    .delete(beneficios)
    .where(and(eq(beneficios.id, id), eq(beneficios.lojaId, session.lojaId)));
  revalidatePath("/beneficios");
}
