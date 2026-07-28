import type { Task } from "@momentum/types";
import { parseLocalDate } from "@momentum/core";
import type { ReminderContent } from "./service";

export function taskDateTime(task: Task): Date | null {
  if (!task.time) return null;
  const day = parseLocalDate(task.date);
  const [h, m] = task.time.split(":").map(Number);
  day.setHours(h, m, 0, 0);
  return day;
}

export function buildReminderContent(task: Task, minutesRemaining: number): ReminderContent {
  const timeLabel = minutesRemaining <= 0 ? "now" : `in ${minutesRemaining} minute${minutesRemaining === 1 ? "" : "s"}`;
  return {
    title: `${task.emoji} ${task.title}`,
    body: `Starts ${timeLabel}!`,
    emoji: task.emoji,
    tag: `momentum-task-${task.id}`,
  };
}
