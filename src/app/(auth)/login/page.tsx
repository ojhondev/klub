import Link from "next/link";
import { KlubMark } from "@/components/brand/klub-mark";
import { signIn } from "../actions";

const ERROS: Record<string, string> = {
  credenciais: "E-mail ou senha incorretos.",
};

const inputClass =
  "rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const erroParam = params.erro;
  const erro = typeof erroParam === "string" ? ERROS[erroParam] : undefined;

  return (
    <div className="flex flex-col gap-6">
      <KlubMark height={28} />

      <div>
        <h1 className="text-xl font-semibold tracking-tight">Entrar</h1>
        <p className="mt-1 text-sm text-fg-muted">Acesse o painel da sua loja.</p>
      </div>

      {erro && (
        <p className="rounded-lg border border-danger-border bg-danger-bg px-4 py-2 text-sm text-danger">
          {erro}
        </p>
      )}

      <form action={signIn} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-fg-muted">
            E-mail
          </label>
          <input id="email" name="email" type="email" required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="senha" className="text-sm font-medium text-fg-muted">
            Senha
          </label>
          <input id="senha" name="senha" type="password" required className={inputClass} />
        </div>
        <button
          type="submit"
          className="mt-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition-opacity hover:opacity-90"
        >
          Entrar
        </button>
      </form>

      <p className="text-center text-sm text-fg-muted">
        Ainda não tem uma loja no Klub?{" "}
        <Link href="/cadastro" className="font-medium text-fg hover:text-accent">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
