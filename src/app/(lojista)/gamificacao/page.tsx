import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { niveis, regrasXp } from "@/db/schema";
import { requireSession } from "@/lib/auth/require-session";
import { createNivel, deleteNivel, createRegraXp, deleteRegraXp } from "./actions";

const ACOES: { value: string; label: string }[] = [
  { value: "compra", label: "Comprar" },
  { value: "avaliacao", label: "Avaliar" },
  { value: "indicacao", label: "Indicar" },
  { value: "ugc", label: "Postar UGC" },
  { value: "outro", label: "Outro" },
];

const inputClass =
  "rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent";

export default async function GamificacaoPage() {
  const session = await requireSession();

  const [listaNiveis, listaRegras] = await Promise.all([
    db
      .select()
      .from(niveis)
      .where(eq(niveis.lojaId, session.lojaId))
      .orderBy(asc(niveis.ordem)),
    db.select().from(regrasXp).where(eq(regrasXp.lojaId, session.lojaId)),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">🏆 Gamificação</h1>
        <p className="mt-1 text-fg-muted">Níveis e regras de XP do seu Klub.</p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Níveis</h2>

        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-fg-muted">
                <th className="px-4 py-3 font-medium">Ordem</th>
                <th className="px-4 py-3 font-medium">Ícone</th>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">XP necessário</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {listaNiveis.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-fg-subtle">
                    Nenhum nível criado ainda.
                  </td>
                </tr>
              )}
              {listaNiveis.map((nivel) => (
                <tr key={nivel.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">{nivel.ordem}</td>
                  <td className="px-4 py-3">{nivel.icone}</td>
                  <td className="px-4 py-3 font-medium">{nivel.nome}</td>
                  <td className="px-4 py-3">{nivel.xpNecessario}</td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteNivel}>
                      <input type="hidden" name="id" value={nivel.id} />
                      <button type="submit" className="text-sm text-fg-subtle hover:text-danger">
                        remover
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form
          action={createNivel}
          className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-surface p-4"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs text-fg-muted">Ícone (emoji)</label>
            <input name="icone" maxLength={4} placeholder="🥉" className={`${inputClass} w-16`} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-fg-muted">Nome</label>
            <input name="nome" required placeholder="Bronze" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-fg-muted">XP necessário</label>
            <input
              name="xpNecessario"
              type="number"
              min={0}
              defaultValue={0}
              className={`${inputClass} w-32`}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-fg-muted">Ordem</label>
            <input
              name="ordem"
              type="number"
              min={0}
              defaultValue={listaNiveis.length}
              className={`${inputClass} w-24`}
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:opacity-90"
          >
            Adicionar nível
          </button>
        </form>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Regras de XP</h2>

        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-fg-muted">
                <th className="px-4 py-3 font-medium">Ação</th>
                <th className="px-4 py-3 font-medium">XP</th>
                <th className="px-4 py-3 font-medium">Descrição</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {listaRegras.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-fg-subtle">
                    Nenhuma regra criada ainda.
                  </td>
                </tr>
              )}
              {listaRegras.map((regra) => (
                <tr key={regra.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">
                    {ACOES.find((a) => a.value === regra.acao)?.label ?? regra.acao}
                  </td>
                  <td className="px-4 py-3">+{regra.xpValor} XP</td>
                  <td className="px-4 py-3 text-fg-muted">{regra.descricao}</td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteRegraXp}>
                      <input type="hidden" name="id" value={regra.id} />
                      <button type="submit" className="text-sm text-fg-subtle hover:text-danger">
                        remover
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form
          action={createRegraXp}
          className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-surface p-4"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs text-fg-muted">Ação</label>
            <select name="acao" defaultValue="compra" className={inputClass}>
              {ACOES.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-fg-muted">XP</label>
            <input name="xpValor" type="number" min={0} defaultValue={100} className={`${inputClass} w-28`} />
          </div>
          <div className="flex min-w-40 flex-1 flex-col gap-1">
            <label className="text-xs text-fg-muted">Descrição (opcional)</label>
            <input name="descricao" placeholder="Ex: compra acima de R$100" className={inputClass} />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:opacity-90"
          >
            Adicionar regra
          </button>
        </form>
      </section>
    </div>
  );
}
