"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTasks } from "@/lib/context/TasksContext";
import { getWeekdayColorByIndex, parseLocalDate } from "@/lib/colors/weekday";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MonthCalendar({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (date: string) => void;
}) {
  const { tasks } = useTasks();
  const [cursor, setCursor] = useState(() => parseLocalDate(selected));

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor));
    const end = endOfWeek(endOfMonth(cursor));
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, typeof tasks>();
    for (const t of tasks) {
      const list = map.get(t.date) ?? [];
      list.push(t);
      map.set(t.date, list);
    }
    return map;
  }, [tasks]);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 card-shadow sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">{format(cursor, "MMMM yyyy")}</h2>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => setCursor((c) => subMonths(c, 1))} aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCursor(new Date())}>
            Today
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => setCursor((c) => addMonths(c, 1))} aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-medium text-muted-foreground">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={format(cursor, "yyyy-MM")}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="mt-1.5 grid grid-cols-7 gap-1.5"
        >
          {days.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const inMonth = isSameMonth(day, cursor);
            const isSelected = isSameDay(day, parseLocalDate(selected));
            const dayTasks = tasksByDate.get(dateStr) ?? [];
            const weekdayColor = getWeekdayColorByIndex(day.getDay());
            const completedCount = dayTasks.filter((t) => t.completed).length;

            return (
              <button
                key={dateStr}
                onClick={() => onSelect(dateStr)}
                className={cn(
                  "relative flex aspect-square flex-col items-center justify-start gap-1 rounded-xl border border-transparent p-1.5 text-xs transition-all sm:p-2",
                  inMonth ? "text-foreground" : "text-muted-foreground/40",
                  isSelected && "border-current shadow-sm",
                  !isSelected && "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
                )}
                style={{
                  backgroundColor: isSelected ? `rgb(${weekdayColor.rgb} / 0.14)` : undefined,
                  color: isSelected ? weekdayColor.hex : undefined,
                }}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold sm:h-6 sm:w-6",
                    isToday(day) && "text-white",
                  )}
                  style={isToday(day) ? { backgroundColor: weekdayColor.hex } : undefined}
                >
                  {format(day, "d")}
                </span>
                <div className="flex flex-wrap items-center justify-center gap-0.5">
                  {dayTasks.slice(0, 4).map((t) => (
                    <span
                      key={t.id}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        backgroundColor: weekdayColor.hex,
                        opacity: t.completed ? 0.35 : 1,
                      }}
                    />
                  ))}
                </div>
                {dayTasks.length > 0 && (
                  <span className="absolute bottom-1 right-1 text-[9px] font-medium text-muted-foreground">
                    {completedCount}/{dayTasks.length}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
