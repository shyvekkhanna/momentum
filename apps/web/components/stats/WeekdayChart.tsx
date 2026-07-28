"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { WEEKDAY_COLORS } from "@momentum/core";

export function WeekdayChart({ counts }: { counts: number[] }) {
  const max = Math.max(1, ...counts);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks completed per weekday</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-40 items-end justify-between gap-2.5">
          {WEEKDAY_COLORS.map((wd) => {
            const count = counts[wd.index];
            const heightPct = (count / max) * 100;
            return (
              <div key={wd.index} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-medium tabular-nums text-muted-foreground">{count}</span>
                <div className="flex h-28 w-full items-end overflow-hidden rounded-lg bg-muted/60">
                  <motion.div
                    className="w-full rounded-lg"
                    style={{ backgroundColor: wd.hex }}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(4, heightPct)}%` }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: wd.index * 0.05 }}
                  />
                </div>
                <span className="text-[11px] font-medium text-muted-foreground">{wd.short}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
