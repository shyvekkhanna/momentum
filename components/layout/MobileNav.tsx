"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./navConfig";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-border bg-card/90 py-2 backdrop-blur-xl lg:hidden">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-xl px-4 py-1.5 text-[11px] font-medium transition-colors",
              active ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <Icon className={cn("h-5 w-5", active && "scale-110")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
