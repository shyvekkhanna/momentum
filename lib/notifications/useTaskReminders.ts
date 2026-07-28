"use client";

import { useEffect, useRef } from "react";
import type { Task } from "@/lib/types/task";
import { parseLocalDate } from "@/lib/colors/weekday";
import { sendTaskReminder } from "./notificationManager";

const REMINDER_LEAD_MINUTES = 5;
const MAX_TIMEOUT_MS = 2 ** 31 - 1; // setTimeout's practical ceiling

function taskDateTime(task: Task): Date | null {
  if (!task.time) return null;
  const day = parseLocalDate(task.date);
  const [h, m] = task.time.split(":").map(Number);
  day.setHours(h, m, 0, 0);
  return day;
}

/**
 * Schedules a reminder `REMINDER_LEAD_MINUTES` before every incomplete,
 * timed task. Re-syncs whenever the task list changes; already-fired
 * reminders are tracked via `reminderSentAt` so a page refresh won't
 * re-notify for a reminder that already went out.
 */
export function useTaskReminders(
  tasks: Task[],
  onReminderSent: (taskId: string, sentAt: string) => void,
) {
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const activeTimers = timers.current;
    for (const timer of activeTimers.values()) clearTimeout(timer);
    activeTimers.clear();

    const now = Date.now();

    for (const task of tasks) {
      if (task.completed || task.reminderSentAt) continue;
      const dt = taskDateTime(task);
      if (!dt) continue;

      const reminderAt = dt.getTime() - REMINDER_LEAD_MINUTES * 60_000;
      const delay = reminderAt - now;

      if (delay < -60_000 || delay > MAX_TIMEOUT_MS) continue; // too late or too far out

      const fire = () => {
        const minutesRemaining = Math.max(
          0,
          Math.round((dt.getTime() - Date.now()) / 60_000),
        );
        sendTaskReminder(task, minutesRemaining);
        onReminderSent(task.id, new Date().toISOString());
      };

      const timer = setTimeout(fire, Math.max(0, delay));
      activeTimers.set(task.id, timer);
    }

    return () => {
      for (const timer of activeTimers.values()) clearTimeout(timer);
      activeTimers.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);
}
