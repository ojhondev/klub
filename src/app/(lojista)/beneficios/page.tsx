import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { beneficios, niveis } from "@/db/schema";
import { requireSession } from "@/lib/auth/require-session";
import { createBeneficio, deleteBeneficio } from "./actions";

const TIPOS: { value: string; label: string }[] = [
  { value: "cupom", label: "Cupom" },
  { value: "cashback", label: "Cashback" },
  { value: "frete_gratis", label: "Frete grátis" },
  { value: "brinde", label: "Brinde" },
  { value: "desconto", label: "Desconto" },
  { value: "produto_exclusivo", label: "Produto exclusivo" },
  { value: "acesso_antecipado", label: "Acesso antecipado" },
];

const inputClass =
  "rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent";

export default async function BeneficiosPage() {
  const session = await requireSession();

  const [listaBeneficios, listaNiveis] = await Promise.all([
    db
      .select({
        id: beneficios.id,
        tipo: beneficios.tipo,
        nome: beneficios.nome,
        valor: beneficios.valor,
        nivelNome: niveis.nome,
        nivelIcone: niveis.icone,
      })
      .from(beneficios)
      .leftJoin(niveis, eq(beneficios.nivelId, niveis.id))
      .where(eq(beneficios.lojaId, session.lojaId))
      .orderBy(desc(beneficios.criadoEm)),
    db
      .select()
      .from(niveis)
      .where(eq(niveis.lojaId, session.lojaId))
      .orderBy(asc(niveis.ordem)),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">🎁 Benefícios</h1>
        <p className="mt-1 text-fg-muted">
          Cupons, cashback, frete grátis e outros benefícios — e quem recebe cada um.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-fg-muted">
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Valor</th>
              <th className="px-4 py-3 font-medium">Público-alvo</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {listaBeneficios.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-fg-subtle">
                  Nenhum benefício criado ainda.
                </td>
              </tr>
            )}
            {listaBeneficios.map((b) => (
              <tr key={b.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">
                  {TIPOS.find((t) => t.value === b.tipo)?.label ?? b.tipo}
                </td>
                <td className="px-4 py-3">{b.nome}</td>
                <td className="px-4 py-3 text-fg-muted">{b.valor || "—"}</td>
                <td className="px-4 py-3">
                  {b.nivelNome ? `${b.nivelIcone ?? ""} ${b.nivelNome}` : "Todos os níveis"}
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteBeneficio}>
                    <input type="hidden" name="id" value={b.id} />
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
        action={createBeneficio}
        className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-surface p-4"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs text-fg-muted">Tipo</label>
          <select name="tipo" defaultValue="cupom" className={inputClass}>
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-fg-muted">Nome</label>
          <input name="nome" required placeholder="10% OFF Klub" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-fg-muted">Valor (opcional)</label>
          <input name="valor" placeholder="10% ou R$20" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-fg-muted">Público-alvo</label>
          <select name="nivelId" defaultValue="" className={inputClass}>
            <option value="">Todos os níveis</option>
            {listaNiveis.map((n) => (
              <option key={n.id} value={n.id}>
                {n.icone} {n.nome}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:opacity-90"
        >
          Adicionar benefício
        </button>
      </form>
    </div>
  );
}
