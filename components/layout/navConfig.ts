import { LayoutDashboard, CalendarDays, BarChart3, ShoppingCart } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, shortcut: "1" },
  { href: "/calendar", label: "Calendar", icon: CalendarDays, shortcut: "2" },
  { href: "/stats", label: "Stats", icon: BarChart3, shortcut: "3" },
  { href: "/shopping", label: "Shopping", icon: ShoppingCart, shortcut: "4" },
] as const;
