export function StatCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <p className="text-sm text-fg-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      {sublabel && <p className="mt-2 text-xs text-fg-subtle">{sublabel}</p>}
    </div>
  );
}
