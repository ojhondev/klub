import type { ReactNode } from "react";
import { Sidebar } from "@/components/lojista/sidebar";

export default function LojistaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-end border-b border-border px-8">
          <div className="size-8 rounded-full bg-surface" />
        </header>
        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
