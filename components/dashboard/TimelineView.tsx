"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTasks } from "@/lib/context/TasksContext";
import { getWeekdayColor } from "@/lib/colors/weekday";
import { formatDuration } from "@/lib/tasks/countdown";
import { todayStr } from "@/lib/tasks/selectors";
import type { Task } from "@/lib/types/task";
import { cn } from "@/lib/utils";

const START_HOUR = 6;
const END_HOUR = 23;
const PX_PER_MIN = 1.1;
const MIN_BLOCK_HEIGHT = 34;

function minutesFromMidnight(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function topFor(time: string): number {
  return (minutesFromMidnight(time) - START_HOUR * 60) * PX_PER_MIN;
}

export function TimelineView({ date, onEdit }: { date: string; onEdit: (task: Task) => void }) {
  const { tasks } = useTasks();
  const [now, setNow] = useState(() => new Date());
  const isToday = date === todayStr();

  useEffect(() => {
    if (!isToday) return;
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, [isToday]);

  const timedTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.date === date && t.time)
        .sort((a, b) => (a.time as string).localeCompare(b.time as string)),
    [tasks, date],
  );

  const dayColor = getWeekdayColor(date);
  const totalHeight = (END_HOUR - START_HOUR) * 60 * PX_PER_MIN;
  const nowTop =
    isToday ? (now.getHours() * 60 + now.getMinutes() - START_HOUR * 60) * PX_PER_MIN : -1;
  const nowVisible = nowTop >= 0 && nowTop <= totalHeight;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card card-shadow">
      <div className="relative flex" style={{ height: totalHeight + 24 }}>
        <div className="flex w-14 shrink-0 flex-col pt-3 sm:w-16">
          {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i).map((h) => (
            <div
              key={h}
              className="relative text-right text-[11px] font-medium text-muted-foreground"
              style={{ height: 60 * PX_PER_MIN }}
            >
              <span className="pr-2">{h % 24 === 0 ? "12am" : h < 12 ? `${h}am` : h === 12 ? "12pm" : `${h - 12}pm`}</span>
            </div>
          ))}
        </div>

        <div className="relative flex-1 border-l border-border pt-3">
          {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => i).map((i) => (
            <div
              key={i}
              className="absolute left-0 right-0 border-t border-border/60"
              style={{ top: i * 60 * PX_PER_MIN + 12 }}
            />
          ))}

          {nowVisible && (
            <motion.div
              className="absolute left-0 right-2 z-10 flex items-center gap-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, top: nowTop + 12 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.25)]" />
              <span className="h-px flex-1 bg-red-500/70" />
            </motion.div>
          )}

          {timedTasks.map((task, idx) => {
            const top = topFor(task.time as string) + 12;
            const height = Math.max(MIN_BLOCK_HEIGHT, task.estimatedDuration * PX_PER_MIN - 4);
            return (
              <motion.button
                key={task.id}
                onClick={() => onEdit(task)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.03 * idx }}
                whileHover={{ scale: 1.01 }}
                className={cn(
                  "absolute left-2 right-2 flex flex-col justify-center overflow-hidden rounded-lg border px-2.5 py-1 text-left shadow-sm sm:left-3 sm:right-4",
                  task.completed && "opacity-50",
                )}
                style={{
                  top,
                  height,
                  backgroundColor: `rgb(${dayColor.rgb} / 0.1)`,
                  borderColor: `rgb(${dayColor.rgb} / 0.35)`,
                  borderLeftWidth: 3,
                  borderLeftColor: dayColor.hex,
                }}
              >
                <span className="truncate text-xs font-medium">
                  {task.emoji} {task.title}
                </span>
                {height > 40 && (
                  <span className="truncate text-[10px] text-muted-foreground">
                    {task.time} · {formatDuration(task.estimatedDuration)}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
