"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function hourLabel(h: number): string {
  if (h === 0) return "12a";
  if (h === 12) return "12p";
  return h < 12 ? `${h}a` : `${h - 12}p`;
}

export function ProductiveHoursChart({ counts }: { counts: number[] }) {
  const max = Math.max(1, ...counts);
  const topHour = counts.indexOf(Math.max(...counts));
  const hasData = counts.some((c) => c > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most productive hours</CardTitle>
        {hasData && (
          <p className="text-xs text-muted-foreground">
            You get the most done around <span className="font-medium text-foreground">{hourLabel(topHour)}</span>
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex h-24 items-end gap-[3px]">
          {counts.map((count, hour) => (
            <motion.div
              key={hour}
              className="flex-1 rounded-sm bg-[var(--ring)]"
              style={{ opacity: count === 0 ? 0.12 : 0.35 + 0.65 * (count / max) }}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(4, (count / max) * 100)}%` }}
              transition={{ duration: 0.5, delay: hour * 0.01 }}
            />
          ))}
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
          <span>12am</span>
          <span>6am</span>
          <span>12pm</span>
          <span>6pm</span>
          <span>11pm</span>
        </div>
      </CardContent>
    </Card>
  );
}
