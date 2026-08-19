import {
  LayoutDashboard,
  Users,
  Trophy,
  Gift,
  Flame,
  MessageCircle,
  Camera,
  Rocket,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const mainNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/membros", label: "Membros", icon: Users },
  { href: "/gamificacao", label: "Gamificação", icon: Trophy },
  { href: "/beneficios", label: "Benefícios", icon: Gift },
  { href: "/drops", label: "Drops", icon: Flame },
  { href: "/comunidade", label: "Comunidade", icon: MessageCircle },
  { href: "/ugc", label: "UGC", icon: Camera },
  { href: "/indicacoes", label: "Indicações", icon: Rocket },
];

export const bottomNavItems: NavItem[] = [
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];
