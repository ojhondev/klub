"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { produtos } from "@/db/schema";
import { requireSession } from "@/lib/auth/require-session";

export async function createProduto(formData: FormData) {
  const session = await requireSession();
  const nome = String(formData.get("nome") ?? "").trim();
  const link = String(formData.get("link") ?? "").trim();
  const imagemUrl = String(formData.get("imagemUrl") ?? "").trim();
  const precoRaw = formData.get("preco");

  if (!nome || !link) return;

  const preco = precoRaw ? Number(precoRaw) : null;

  await db.insert(produtos).values({
    lojaId: session.lojaId,
    nome,
    link,
    preco: preco !== null && Number.isFinite(preco) ? String(preco) : null,
    imagemUrl: imagemUrl || null,
  });

  revalidatePath("/configuracoes");
}

export async function deleteProduto(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await db
    .delete(produtos)
    .where(and(eq(produtos.id, id), eq(produtos.lojaId, session.lojaId)));
  revalidatePath("/configuracoes");
}
