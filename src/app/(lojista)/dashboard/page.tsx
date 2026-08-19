import { StatCard } from "@/components/ui/stat-card";
import { requireSession } from "@/lib/auth/require-session";
import { getDashboardKpis } from "@/lib/queries/dashboard";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default async function DashboardPage() {
  const session = await requireSession();
  const kpis = await getDashboardKpis(session.lojaId);

  const cards: { label: string; value: string; sublabel?: string }[] = [
    { label: "Membros", value: String(kpis.membros) },
    { label: "Novos membros (30d)", value: String(kpis.novosMembros) },
    { label: "Membros ativos", value: String(kpis.membrosAtivos) },
    {
      label: "LTV dos membros",
      value: kpis.ltvMembros !== null ? currency.format(kpis.ltvMembros) : "—",
    },
    {
      label: "LTV dos não membros",
      value: "—",
      sublabel: "requer integração de pedidos (Fase 9)",
    },
    {
      label: "Taxa de recompra",
      value: kpis.taxaRecompra !== null ? `${kpis.taxaRecompra}%` : "—",
    },
    { label: "Receita gerada pelo Klub", value: currency.format(kpis.receitaKlub) },
    { label: "Receita de membros", value: currency.format(kpis.receitaMembros) },
    { label: "Pedidos originados pelo Klub", value: String(kpis.pedidosKlub) },
    { label: "Indicações", value: String(kpis.indicacoes) },
    { label: "CAC economizado", value: "—", sublabel: "requer dado de CAC pago (Fase 9)" },
    { label: "UGC gerado", value: `${kpis.ugcGerado} posts` },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-fg-muted">O Klub está gerando dinheiro?</p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <p className="text-sm text-fg-muted">Klub Growth Score</p>
        <p className="mt-2 text-2xl font-semibold text-fg-subtle">
          <span className="text-fg-subtle">—</span>{" "}
          <span className="text-sm font-normal text-fg-muted">
            calculando conforme os dados chegam
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            sublabel={card.sublabel}
          />
        ))}
      </div>
    </div>
  );
}
