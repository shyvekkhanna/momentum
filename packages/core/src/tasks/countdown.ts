import type { Task } from "@momentum/types";
import { parseLocalDate } from "../dates/weekday";

export interface CountdownInfo {
  label: string;
  status: "upcoming" | "soon" | "overdue" | "none";
}

/** Human countdown label relative to `now`, recomputed by the caller on an interval. */
export function getCountdown(task: Task, now: Date = new Date()): CountdownInfo {
  if (task.completed || !task.time) return { label: "", status: "none" };

  const target = parseLocalDate(task.date);
  const [h, m] = task.time.split(":").map(Number);
  target.setHours(h, m, 0, 0);

  const diffMs = target.getTime() - now.getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 0) {
    const overdueMin = Math.abs(diffMin);
    const label =
      overdueMin < 60
        ? `Overdue ${overdueMin}m`
        : `Overdue ${Math.floor(overdueMin / 60)}h ${overdueMin % 60}m`;
    return { label, status: "overdue" };
  }

  if (diffMin === 0) return { label: "Now", status: "soon" };

  if (diffMin < 60) {
    return { label: `in ${diffMin}m`, status: diffMin <= 15 ? "soon" : "upcoming" };
  }

  const hours = Math.floor(diffMin / 60);
  const mins = diffMin % 60;
  if (hours < 24) {
    return { label: mins ? `in ${hours}h ${mins}m` : `in ${hours}h`, status: "upcoming" };
  }

  const days = Math.floor(hours / 24);
  return { label: `in ${days}d`, status: "upcoming" };
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}
