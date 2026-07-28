import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import type { Task } from "@/lib/types/task";
import { parseLocalDate } from "@/lib/colors/weekday";

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

export interface CompletionStats {
  total: number;
  completed: number;
  remaining: number;
  percent: number;
}

export function computeCompletionStats(tasks: Task[], date: string): CompletionStats {
  const dayTasks = getTasksForDate(tasks, date);
  const completed = dayTasks.filter((t) => t.completed).length;
  const total = dayTasks.length;
  return {
    total,
    completed,
    remaining: total - completed,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export interface StreakStats {
  current: number;
  longest: number;
}

/** A day "counts" toward the streak if every task scheduled that day was completed. */
export function computeStreak(tasks: Task[]): StreakStats {
  const byDate = new Map<string, Task[]>();
  for (const t of tasks) {
    const list = byDate.get(t.date) ?? [];
    list.push(t);
    byDate.set(t.date, list);
  }

  const qualifyingDates = [...byDate.entries()]
    .filter(([, dayTasks]) => dayTasks.length > 0 && dayTasks.every((t) => t.completed))
    .map(([date]) => date)
    .sort();

  if (qualifyingDates.length === 0) return { current: 0, longest: 0 };

  let longest = 1;
  let run = 1;
  for (let i = 1; i < qualifyingDates.length; i++) {
    const prev = parseLocalDate(qualifyingDates[i - 1]);
    const curr = parseLocalDate(qualifyingDates[i]);
    if (isSameDay(addDays(prev, 1), curr)) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
  }

  // Current streak: walk backward from today/yesterday while days qualify.
  const qualifiedSet = new Set(qualifyingDates);
  let cursor = new Date();
  if (!qualifiedSet.has(format(cursor, "yyyy-MM-dd"))) {
    cursor = subDays(cursor, 1); // allow "today not finished yet" without breaking the streak
  }
  let current = 0;
  while (qualifiedSet.has(format(cursor, "yyyy-MM-dd"))) {
    current += 1;
    cursor = subDays(cursor, 1);
  }

  return { current, longest };
}

export function computeTasksPerWeekday(tasks: Task[]): number[] {
  const counts = [0, 0, 0, 0, 0, 0, 0];
  for (const t of tasks.filter((t) => t.completed)) {
    counts[parseLocalDate(t.date).getDay()] += 1;
  }
  return counts;
}

export function computeMostProductiveHours(tasks: Task[]): number[] {
  const counts = new Array(24).fill(0);
  for (const t of tasks) {
    if (!t.completed || !t.completedAt) continue;
    counts[new Date(t.completedAt).getHours()] += 1;
  }
  return counts;
}

export interface HeatmapDay {
  date: string;
  count: number;
}

export function computeHeatmap(tasks: Task[], weeks = 17): HeatmapDay[] {
  const end = endOfWeek(new Date());
  const start = startOfWeek(subDays(end, weeks * 7 - 1));
  const completedByDate = new Map<string, number>();
  for (const t of tasks) {
    if (!t.completed) continue;
    completedByDate.set(t.date, (completedByDate.get(t.date) ?? 0) + 1);
  }
  return eachDayOfInterval({ start, end }).map((d) => {
    const key = format(d, "yyyy-MM-dd");
    return { date: key, count: completedByDate.get(key) ?? 0 };
  });
}

export function computeRangeSummary(
  tasks: Task[],
  referenceDate: Date,
  range: "week" | "month",
): CompletionStats {
  const interval =
    range === "week"
      ? { start: startOfWeek(referenceDate), end: endOfWeek(referenceDate) }
      : { start: startOfMonth(referenceDate), end: endOfMonth(referenceDate) };

  const inRange = tasks.filter((t) => {
    const d = parseLocalDate(t.date);
    return d >= interval.start && d <= interval.end;
  });

  const completed = inRange.filter((t) => t.completed).length;
  const total = inRange.length;
  return {
    total,
    completed,
    remaining: total - completed,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function computeOverallCompletionRate(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  return Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100);
}
