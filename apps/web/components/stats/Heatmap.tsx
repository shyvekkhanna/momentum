"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getWeekdayColor, parseLocalDate } from "@momentum/core";
import type { HeatmapDay } from "@momentum/core";

export function Heatmap({ days }: { days: HeatmapDay[] }) {
  const weeks = useMemo(() => {
    const cols: HeatmapDay[][] = [];
    for (let i = 0; i < days.length; i += 7) cols.push(days.slice(i, i + 7));
    return cols;
  }, [days]);

  const max = Math.max(1, ...days.map((d) => d.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity heatmap</CardTitle>
        <p className="text-xs text-muted-foreground">Each square tinted with that day&apos;s colour, deeper when busier.</p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) => {
                const color = getWeekdayColor(parseLocalDate(day.date));
                const intensity = day.count === 0 ? 0.06 : 0.25 + 0.75 * (day.count / max);
                return (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25, delay: (wi * 7 + di) * 0.003 }}
                    title={`${format(parseLocalDate(day.date), "MMM d")} · ${day.count} completed`}
                    className="h-3 w-3 rounded-[3px] sm:h-3.5 sm:w-3.5"
                    style={{ backgroundColor: `rgb(${color.rgb} / ${intensity})` }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
