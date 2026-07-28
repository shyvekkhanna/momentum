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
import { cn } from "@/lib/utils";
import { getWeekdayColorByIndex, parseLocalDate } from "@/lib/colors/weekday";
import { Button } from "@/components/ui/button";

interface MiniCalendarProps {
  value?: string; // yyyy-MM-dd
  onChange: (date: string) => void;
  dotForDate?: (date: string) => string | undefined; // returns a hex color if the day should show a dot
  className?: string;
}

export function MiniCalendar({ value, onChange, dotForDate, className }: MiniCalendarProps) {
  const [cursor, setCursor] = useState(() => (value ? parseLocalDate(value) : new Date()));

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor));
    const end = endOfWeek(endOfMonth(cursor));
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  return (
    <div className={cn("w-full select-none", className)}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold tracking-tight">{format(cursor, "MMMM yyyy")}</span>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setCursor((c) => subMonths(c, 1))}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setCursor((c) => addMonths(c, 1))}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={`${d}-${i}`} className="text-[11px] font-medium text-muted-foreground">
            {d}
          </div>
        ))}
        <AnimatePresence mode="wait">
          <motion.div
            key={format(cursor, "yyyy-MM")}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18 }}
            className="col-span-7 grid grid-cols-7 gap-y-1"
          >
            {days.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const inMonth = isSameMonth(day, cursor);
              const selected = value ? isSameDay(day, parseLocalDate(value)) : false;
              const dot = dotForDate?.(dateStr);
              const weekdayColor = getWeekdayColorByIndex(day.getDay());
              return (
                <button
                  type="button"
                  key={dateStr}
                  onClick={() => onChange(dateStr)}
                  className={cn(
                    "relative mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all",
                    inMonth ? "text-foreground" : "text-muted-foreground/40",
                    selected && "text-white shadow-sm",
                    !selected && "hover:bg-black/[0.05] dark:hover:bg-white/[0.08]",
                    isToday(day) && !selected && "ring-1 ring-inset ring-[var(--ring)]",
                  )}
                  style={selected ? { backgroundColor: weekdayColor.hex } : undefined}
                >
                  {format(day, "d")}
                  {dot && !selected && (
                    <span
                      className="absolute bottom-0.5 h-1 w-1 rounded-full"
                      style={{ backgroundColor: dot }}
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
