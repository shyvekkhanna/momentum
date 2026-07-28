"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { NAV_ITEMS } from "./navConfig";
import { FloatingAddButton } from "@/components/tasks/FloatingAddButton";
import { useUI } from "@/lib/context/UIContext";
import { useKeyboardShortcuts } from "@/lib/hooks/useKeyboardShortcuts";
import { useMounted } from "@/lib/hooks/useMounted";
import { getWeekdayColor, todayStr } from "@momentum/core";
import { weekdaySoftGradient } from "@/lib/colors/weekdayGradient";

export function AppShell({
  children,
  accentDate,
}: {
  children: React.ReactNode;
  accentDate?: string;
}) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { setCreateTaskOpen, setCommandPaletteOpen } = useUI();
  const mounted = useMounted();

  const dayColor = getWeekdayColor(accentDate ?? todayStr());
  const gradient = weekdaySoftGradient(dayColor, mounted && resolvedTheme === "dark");

  useKeyboardShortcuts({
    onNewTask: () => setCreateTaskOpen(true),
    onSearch: () => setCommandPaletteOpen(true),
    onNavigate: (key) => {
      const index = Number(key) - 1;
      const item = NAV_ITEMS[index];
      if (item) router.push(item.href);
    },
    onToggleTheme: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
  });

  return (
    <div className="min-h-screen" style={{ backgroundImage: gradient }}>
      <Sidebar />
      <MobileNav />
      <main className="min-h-screen pb-24 pt-6 lg:pb-10 lg:pl-64">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-10">{children}</div>
      </main>
      <FloatingAddButton />
    </div>
  );
}
