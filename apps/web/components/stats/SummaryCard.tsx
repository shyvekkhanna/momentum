"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useCountUp } from "@/lib/hooks/useCountUp";
import type { CompletionStats } from "@momentum/core";

export function SummaryCard({ title, stats, color }: { title: string; stats: CompletionStats; color: string }) {
  const animatedPercent = useCountUp(stats.percent);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <p className="text-3xl font-semibold tabular-nums">{animatedPercent}%</p>
          <p className="text-xs text-muted-foreground">
            {stats.completed} of {stats.total} completed
          </p>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${stats.percent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
