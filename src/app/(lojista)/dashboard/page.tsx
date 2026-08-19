import { StatCard } from "@/components/ui/stat-card";

const kpis = [
  { label: "Membros", value: "3.482" },
  { label: "Novos membros (30d)", value: "312" },
  { label: "Membros ativos", value: "1.940" },
  { label: "LTV dos membros", value: "R$ 842" },
  { label: "LTV dos não membros", value: "R$ 351" },
  { label: "Taxa de recompra", value: "38%" },
  { label: "Receita gerada pelo Klub", value: "R$ 128.400" },
  { label: "Receita de membros", value: "R$ 96.200" },
  { label: "Pedidos originados pelo Klub", value: "614" },
  { label: "Indicações", value: "227" },
  { label: "CAC economizado", value: "R$ 18.900" },
  { label: "UGC gerado", value: "156 posts" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-fg-muted">O Klub está gerando dinheiro?</p>
      </div>

      <div className="rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 to-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-fg-muted">Klub Growth Score</p>
            <p className="mt-2 text-4xl font-bold tracking-tight text-accent">
              87<span className="text-lg text-fg-muted">/100</span> 🚀
            </p>
          </div>
          <p className="max-w-xs text-sm text-fg-muted">
            Membros compram <span className="font-semibold text-fg">2,4x mais</span> que
            não membros.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <StatCard key={kpi.label} label={kpi.label} value={kpi.value} />
        ))}
      </div>
    </div>
  );
}
