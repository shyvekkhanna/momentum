"use client";

import { useMemo } from "react";
import { addWeeks, eachDayOfInterval, endOfWeek, format, isToday, startOfWeek, subWeeks } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTasks } from "@/lib/context/TasksContext";
import { getWeekdayColorByIndex, parseLocalDate } from "@/lib/colors/weekday";
import { getTasksForDate } from "@/lib/tasks/selectors";
import { Button } from "@/components/ui/button";
import type { Task } from "@/lib/types/task";
import { cn } from "@/lib/utils";

export function WeekCalendar({
  selected,
  onSelect,
  onEditTask,
}: {
  selected: string;
  onSelect: (date: string) => void;
  onEditTask: (task: Task) => void;
}) {
  const { tasks } = useTasks();
  const anchor = parseLocalDate(selected);

  const days = useMemo(() => {
    const start = startOfWeek(anchor);
    const end = endOfWeek(anchor);
    return eachDayOfInterval({ start, end });
  }, [anchor]);

  const weekLabel = `${format(days[0], "MMM d")} – ${format(days[6], "MMM d, yyyy")}`;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 card-shadow sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">{weekLabel}</h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onSelect(format(subWeeks(anchor, 1), "yyyy-MM-dd"))}
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onSelect(format(new Date(), "yyyy-MM-dd"))}>
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onSelect(format(addWeeks(anchor, 1), "yyyy-MM-dd"))}
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={format(days[0], "yyyy-MM-dd")}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-7"
        >
          {days.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const color = getWeekdayColorByIndex(day.getDay());
            const dayTasks = getTasksForDate(tasks, dateStr);
            const isSelected = dateStr === selected;

            return (
              <div key={dateStr} className="flex min-h-[10rem] flex-col rounded-xl border border-border/70 p-2">
                <button
                  onClick={() => onSelect(dateStr)}
                  className={cn(
                    "mb-2 flex items-center justify-between rounded-lg px-1.5 py-1 text-left transition-colors",
                    isSelected && "bg-black/[0.04] dark:bg-white/[0.08]",
                  )}
                >
                  <span className="text-[11px] font-medium text-muted-foreground">{format(day, "EEE")}</span>
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                      isToday(day) && "text-white",
                    )}
                    style={isToday(day) ? { backgroundColor: color.hex } : { color: color.hex }}
                  >
                    {format(day, "d")}
                  </span>
                </button>

                <div className="flex flex-1 flex-col gap-1 overflow-y-auto">
                  {dayTasks.length === 0 ? (
                    <p className="px-1 text-[11px] text-muted-foreground/60">—</p>
                  ) : (
                    dayTasks.map((task) => (
                      <button
                        key={task.id}
                        onClick={() => onEditTask(task)}
                        className={cn(
                          "flex items-center gap-1 truncate rounded-md px-1.5 py-1 text-left text-[11px] font-medium transition-colors hover:bg-black/[0.05] dark:hover:bg-white/[0.08]",
                          task.completed && "text-muted-foreground line-through",
                        )}
                        style={{ borderLeft: `3px solid ${color.hex}` }}
                      >
                        <span>{task.emoji}</span>
                        <span className="truncate">{task.title}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
