import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { regrasXp } from "@/db/schema";
import { requireSession } from "@/lib/auth/require-session";
import { getMembro } from "@/lib/queries/membros";
import { registrarAcao } from "../actions";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dataFmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

const ACOES: Record<string, string> = {
  compra: "Comprar",
  avaliacao: "Avaliar",
  indicacao: "Indicar",
  ugc: "Postar UGC",
  outro: "Outro",
};

export default async function MembroPage({ params }: PageProps<"/membros/[id]">) {
  const session = await requireSession();
  const { id } = await params;

  const membro = await getMembro(session.lojaId, id);
  if (!membro) notFound();

  const regras = await db.select().from(regrasXp).where(eq(regrasXp.lojaId, session.lojaId));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{membro.nome}</h1>
        <p className="mt-1 text-fg-muted">{membro.email}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm text-fg-muted">Nível</p>
          <p className="mt-2 text-2xl font-semibold">
            {membro.nivelNome ? `${membro.nivelIcone ?? ""} ${membro.nivelNome}` : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm text-fg-muted">XP total</p>
          <p className="mt-2 text-2xl font-semibold">{membro.xpTotal}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm text-fg-muted">Membro desde</p>
          <p className="mt-2 text-2xl font-semibold">{dataFmt.format(membro.entrouEm)}</p>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Registrar ação</h2>
        <p className="text-sm text-fg-muted">
          Aplica a regra de XP configurada em Gamificação. Use isso enquanto não há
          integração automática com pedidos.
        </p>
        <form
          action={registrarAcao}
          className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-surface p-4"
        >
          <input type="hidden" name="membroId" value={membro.id} />
          <div className="flex flex-col gap-1">
            <label className="text-xs text-fg-muted">Ação</label>
            <select
              name="acao"
              className="rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            >
              {Object.entries(ACOES).map(([value, label]) => {
                const regra = regras.find((r) => r.acao === value);
                return (
                  <option key={value} value={value}>
                    {label} {regra ? `(+${regra.xpValor} XP)` : "(sem regra de XP)"}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-fg-muted">Valor (se compra)</label>
            <input
              name="valor"
              type="number"
              min={0}
              step="0.01"
              defaultValue={0}
              className="w-32 rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:opacity-90"
          >
            Registrar
          </button>
        </form>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Histórico de compras</h2>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-fg-muted">
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Valor</th>
                <th className="px-4 py-3 font-medium">Origem</th>
              </tr>
            </thead>
            <tbody>
              {membro.compras.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-fg-subtle">
                    Nenhuma compra registrada ainda.
                  </td>
                </tr>
              )}
              {membro.compras.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">{dataFmt.format(c.criadoEm)}</td>
                  <td className="px-4 py-3">{currency.format(Number(c.valor))}</td>
                  <td className="px-4 py-3 text-fg-muted">{c.origem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
