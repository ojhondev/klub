import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { lojas } from "@/db/schema";
import { joinLoja } from "./actions";

const inputClass =
  "rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent";

export default async function JoinPage({ params, searchParams }: PageProps<"/j/[slug]">) {
  const { slug } = await params;
  const query = await searchParams;

  const [loja] = await db
    .select({ id: lojas.id, nome: lojas.nome })
    .from(lojas)
    .where(eq(lojas.slug, slug))
    .limit(1);
  if (!loja) notFound();

  const sucesso = query.sucesso === "1";
  const erro = query.erro === "dados_invalidos";

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-accent text-sm font-bold text-accent-fg">
            K
          </span>
          <span className="text-lg font-bold tracking-tight">Klub</span>
        </div>

        {sucesso ? (
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold tracking-tight">Você está dentro! 🎉</h1>
            <p className="text-sm text-fg-muted">
              Bem-vindo(a) ao Clube da {loja.nome}. Fique de olho nos seus benefícios e
              drops exclusivos.
            </p>
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Entrar no Clube da {loja.nome}
              </h1>
              <p className="mt-1 text-sm text-fg-muted">Compre, participe, evolua, desbloqueie.</p>
            </div>

            {erro && (
              <p className="rounded-lg border border-danger-border bg-danger-bg px-4 py-2 text-sm text-danger">
                Preencha nome e e-mail.
              </p>
            )}

            <form action={joinLoja} className="flex flex-col gap-4">
              <input type="hidden" name="slug" value={slug} />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="nome" className="text-sm font-medium text-fg-muted">
                  Seu nome
                </label>
                <input id="nome" name="nome" type="text" required className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-fg-muted">
                  E-mail
                </label>
                <input id="email" name="email" type="email" required className={inputClass} />
              </div>
              <button
                type="submit"
                className="mt-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition-opacity hover:opacity-90"
              >
                Entrar no clube
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
