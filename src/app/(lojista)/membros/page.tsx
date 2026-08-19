import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { lojas } from "@/db/schema";
import { requireSession } from "@/lib/auth/require-session";
import { listMembros, type FiltroMembros } from "@/lib/queries/membros";
import { createMembroManual } from "./actions";

const FILTROS: { value: FiltroMembros; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "vip", label: "VIP" },
  { value: "inativos", label: "Inativos" },
  { value: "novos", label: "Novos" },
  { value: "recorrentes", label: "Recorrentes" },
  { value: "top", label: "Top clientes" },
];

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dataFmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

export default async function MembrosPage({ searchParams }: PageProps<"/membros">) {
  const session = await requireSession();
  const params = await searchParams;
  const filtroParam = params.filtro;
  const filtro: FiltroMembros = FILTROS.some((f) => f.value === filtroParam)
    ? (filtroParam as FiltroMembros)
    : "todos";

  const [membrosLista, [lojaInfo]] = await Promise.all([
    listMembros(session.lojaId, filtro),
    db.select({ slug: lojas.slug }).from(lojas).where(eq(lojas.id, session.lojaId)).limit(1),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">👥 Membros</h1>
        <p className="mt-1 text-fg-muted">CRM dos clientes que participam do Klub.</p>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4">
        <div>
          <p className="text-sm font-medium">Link de adesão</p>
          <p className="text-sm text-fg-muted">/j/{lojaInfo?.slug}</p>
        </div>
        <a
          href={`/j/${lojaInfo?.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-accent hover:underline"
        >
          Abrir ↗
        </a>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "todos" ? "/membros" : `/membros?filtro=${f.value}`}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              filtro === f.value
                ? "bg-accent text-accent-fg"
                : "bg-surface text-fg-muted hover:text-fg"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-fg-muted">
              <th className="px-4 py-3 font-medium">Membro</th>
              <th className="px-4 py-3 font-medium">Nível</th>
              <th className="px-4 py-3 font-medium">XP</th>
              <th className="px-4 py-3 font-medium">Compras</th>
              <th className="px-4 py-3 font-medium">Total gasto</th>
              <th className="px-4 py-3 font-medium">Entrou em</th>
            </tr>
          </thead>
          <tbody>
            {membrosLista.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-fg-subtle">
                  Nenhum membro encontrado neste filtro.
                </td>
              </tr>
            )}
            {membrosLista.map((m) => (
              <tr key={m.id} className="border-b border-border last:border-0 hover:bg-surface-hover">
                <td className="px-4 py-3">
                  <Link href={`/membros/${m.id}`} className="font-medium hover:text-accent">
                    {m.nome}
                  </Link>
                  <p className="text-xs text-fg-subtle">{m.email}</p>
                </td>
                <td className="px-4 py-3">
                  {m.nivelNome ? `${m.nivelIcone ?? ""} ${m.nivelNome}` : "—"}
                </td>
                <td className="px-4 py-3">{m.xpTotal}</td>
                <td className="px-4 py-3">{m.totalCompras}</td>
                <td className="px-4 py-3">{currency.format(m.totalGasto)}</td>
                <td className="px-4 py-3 text-fg-muted">{dataFmt.format(m.entrouEm)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form
        action={createMembroManual}
        className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-surface p-4"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs text-fg-muted">Nome</label>
          <input
            name="nome"
            required
            className="rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-fg-muted">E-mail</label>
          <input
            name="email"
            type="email"
            required
            className="rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:opacity-90"
        >
          Adicionar membro manualmente
        </button>
      </form>
    </div>
  );
}
