import Link from "next/link";
import { signUp } from "../actions";

const ERROS: Record<string, string> = {
  dados_invalidos: "Preencha todos os campos (senha com pelo menos 8 caracteres).",
  email_em_uso: "Já existe uma conta com este e-mail.",
};

const inputClass =
  "rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent";

export default async function CadastroPage({ searchParams }: PageProps<"/cadastro">) {
  const params = await searchParams;
  const erroParam = params.erro;
  const erro = typeof erroParam === "string" ? ERROS[erroParam] : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-md bg-accent text-sm font-bold text-accent-fg">
          K
        </span>
        <span className="text-lg font-bold tracking-tight">Klub</span>
      </div>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">Criar sua loja no Klub</h1>
        <p className="mt-1 text-sm text-fg-muted">Leva menos de um minuto.</p>
      </div>

      {erro && (
        <p className="rounded-lg border border-danger-border bg-danger-bg px-4 py-2 text-sm text-danger">
          {erro}
        </p>
      )}

      <form action={signUp} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="nomeLoja" className="text-sm font-medium text-fg-muted">
            Nome da loja
          </label>
          <input id="nomeLoja" name="nomeLoja" type="text" required className={inputClass} />
        </div>
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
        <div className="flex flex-col gap-1.5">
          <label htmlFor="senha" className="text-sm font-medium text-fg-muted">
            Senha
          </label>
          <input
            id="senha"
            name="senha"
            type="password"
            required
            minLength={8}
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          className="mt-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition-opacity hover:opacity-90"
        >
          Criar conta
        </button>
      </form>

      <p className="text-center text-sm text-fg-muted">
        Já tem uma conta?{" "}
        <Link href="/login" className="font-medium text-fg hover:text-accent">
          Entrar
        </Link>
      </p>
    </div>
  );
}
