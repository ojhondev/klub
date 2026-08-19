export function PlaceholderPage({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-semibold tracking-tight">
        {emoji} {title}
      </h1>
      <p className="mt-1 text-fg-muted">{description}</p>

      <div className="mt-8 flex min-h-72 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border p-12 text-center">
        <p className="text-sm font-medium text-fg-muted">Em construção</p>
        <p className="max-w-md text-sm text-fg-subtle">
          Esta área ainda não foi implementada. Ver escopo em{" "}
          <code className="rounded bg-surface px-1.5 py-0.5">docs/PRD.md</code>.
        </p>
      </div>
    </div>
  );
}
