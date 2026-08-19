"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNavItems, bottomNavItems, type NavItem } from "./nav-items";

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-surface text-fg"
          : "text-fg-muted hover:bg-surface hover:text-fg"
      }`}
    >
      <Icon className="size-4.5" strokeWidth={2} />
      {item.label}
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border px-4 py-6">
      <div className="mb-8 flex items-center gap-2 px-2">
        <span className="flex size-7 items-center justify-center rounded-md bg-accent text-sm font-bold text-accent-fg">
          K
        </span>
        <span className="text-lg font-bold tracking-tight">Klub</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {mainNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      <div className="flex flex-col gap-1 border-t border-border pt-4">
        {bottomNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </div>
    </aside>
  );
}
