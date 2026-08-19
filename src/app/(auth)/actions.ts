"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { lojas, usuarios } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { slugify, randomSuffix } from "@/lib/slug";

async function generateUniqueSlug(nome: string): Promise<string> {
  const base = slugify(nome) || "loja";
  let slug = base;

  for (let tentativa = 0; tentativa < 5; tentativa++) {
    const [existente] = await db
      .select({ id: lojas.id })
      .from(lojas)
      .where(eq(lojas.slug, slug))
      .limit(1);

    if (!existente) return slug;
    slug = `${base}-${randomSuffix()}`;
  }

  return `${base}-${randomSuffix()}`;
}

export async function signUp(formData: FormData) {
  const nomeLoja = String(formData.get("nomeLoja") ?? "").trim();
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");

  if (!nomeLoja || !nome || !email || senha.length < 8) {
    redirect("/cadastro?erro=dados_invalidos");
  }

  const [existente] = await db
    .select({ id: usuarios.id })
    .from(usuarios)
    .where(eq(usuarios.email, email))
    .limit(1);

  if (existente) {
    redirect("/cadastro?erro=email_em_uso");
  }

  const slug = await generateUniqueSlug(nomeLoja);

  const [loja] = await db.insert(lojas).values({ nome: nomeLoja, slug }).returning();
  const [usuario] = await db
    .insert(usuarios)
    .values({ lojaId: loja.id, nome, email, senhaHash: hashPassword(senha) })
    .returning();

  await createSession(usuario.id, loja.id);
  redirect("/dashboard");
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");

  const [usuario] = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.email, email))
    .limit(1);

  if (!usuario || !verifyPassword(senha, usuario.senhaHash)) {
    redirect("/login?erro=credenciais");
  }

  await createSession(usuario.id, usuario.lojaId);
  redirect("/dashboard");
}

export async function signOut() {
  await destroySession();
  redirect("/login");
}
