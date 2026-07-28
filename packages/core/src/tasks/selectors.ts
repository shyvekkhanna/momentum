import { format } from "date-fns";
import type { Task } from "@momentum/types";

export const todayStr = () => format(new Date(), "yyyy-MM-dd");

export function getTasksForDate(tasks: Task[], date: string): Task[] {
  return tasks
    .filter((t) => t.date === date)
    .sort((a, b) => (a.time ?? "99:99").localeCompare(b.time ?? "99:99"));
}

export function getUpcomingTasks(tasks: Task[], limit = 5): Task[] {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const today = todayStr();

  return tasks
    .filter((t) => {
      if (t.completed) return false;
      if (t.date < today) return false;
      if (t.date === today && t.time) {
        const [h, m] = t.time.split(":").map(Number);
        if (h * 60 + m < nowMinutes) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return (a.time ?? "99:99").localeCompare(b.time ?? "99:99");
    })
    .slice(0, limit);
}

export function getCompletedToday(tasks: Task[]): Task[] {
  const today = todayStr();
  return tasks
    .filter((t) => t.completed && t.date === today)
    .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));
}
