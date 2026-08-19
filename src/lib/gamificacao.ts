import { niveis } from "@/db/schema";

type Nivel = typeof niveis.$inferSelect;

export function resolveNivel(lista: Nivel[], xpTotal: number): Nivel | null {
  const elegiveis = lista
    .filter((n) => n.xpNecessario <= xpTotal)
    .sort((a, b) => b.xpNecessario - a.xpNecessario);

  return elegiveis[0] ?? null;
}
