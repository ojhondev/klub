"use server";

import { redirect } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { lojas, membros, niveis } from "@/db/schema";

export async function joinLoja(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!slug) redirect("/");

  if (!nome || !email) {
    redirect(`/j/${slug}?erro=dados_invalidos`);
  }

  const [loja] = await db
    .select({ id: lojas.id })
    .from(lojas)
    .where(eq(lojas.slug, slug))
    .limit(1);
  if (!loja) redirect("/");

  const [existente] = await db
    .select({ id: membros.id })
    .from(membros)
    .where(and(eq(membros.lojaId, loja.id), eq(membros.email, email)))
    .limit(1);

  if (existente) {
    redirect(`/j/${slug}?sucesso=1`);
  }

  const [nivelInicial] = await db
    .select()
    .from(niveis)
    .where(eq(niveis.lojaId, loja.id))
    .orderBy(asc(niveis.ordem))
    .limit(1);

  await db.insert(membros).values({
    lojaId: loja.id,
    nome,
    email,
    nivelId: nivelInicial?.id ?? null,
  });

  redirect(`/j/${slug}?sucesso=1`);
}
