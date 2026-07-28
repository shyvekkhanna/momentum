import { useEffect, useRef } from "react";
import type { Task } from "@momentum/types";
import { buildReminderContent, taskDateTime } from "./reminderContent";
import type { NotificationService } from "./service";

const REMINDER_LEAD_MINUTES = 5;
const MAX_TIMEOUT_MS = 2 ** 31 - 1; // setTimeout's practical ceiling

/**
 * Schedules a reminder `REMINDER_LEAD_MINUTES` before every incomplete,
 * timed task, delivered through the injected `NotificationService`.
 * Re-syncs whenever the task list changes; already-fired reminders are
 * tracked via `reminderSentAt` so a page refresh won't re-notify for a
 * reminder that already went out. Relies only on React state/timers, so the
 * same hook works for both the web app and a future Expo app — only the
 * `NotificationService` implementation differs per platform.
 */
export function useTaskReminders(
  tasks: Task[],
  notificationService: NotificationService,
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
        notificationService.notify(buildReminderContent(task, minutesRemaining));
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
  }, [tasks, notificationService]);
}
