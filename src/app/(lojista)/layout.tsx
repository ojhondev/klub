import type { ReactNode } from "react";
import { eq } from "drizzle-orm";
import { LogOut } from "lucide-react";
import { db } from "@/db";
import { lojas } from "@/db/schema";
import { requireSession } from "@/lib/auth/require-session";
import { signOut } from "@/app/(auth)/actions";
import { Sidebar } from "@/components/lojista/sidebar";

export default async function LojistaLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();
  const [loja] = await db
    .select({ nome: lojas.nome })
    .from(lojas)
    .where(eq(lojas.id, session.lojaId))
    .limit(1);

  return (
    <div className="flex min-h-screen">
      <Sidebar lojaNome={loja?.nome} />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-end border-b border-border px-8">
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-fg-muted transition-colors hover:bg-surface hover:text-fg"
            >
              <LogOut className="size-4" strokeWidth={2} />
              Sair
            </button>
          </form>
        </header>
        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
