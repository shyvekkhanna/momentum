import { addDays, addHours, addMinutes, format } from "date-fns";
import type { PostponeOption, Task } from "@/lib/types/task";
import { parseLocalDate } from "@/lib/colors/weekday";

export interface PostponeResult {
  date: string;
  time: string;
}

export const POSTPONE_LABELS: Record<PostponeOption, string> = {
  "10m": "10 minutes",
  "30m": "30 minutes",
  "1h": "1 hour",
  tomorrow: "Tomorrow",
  "next-week": "Next week",
  custom: "Custom date & time",
};

export function computePostponedDateTime(
  task: Task,
  option: PostponeOption,
  custom?: { date: string; time: string },
): PostponeResult {
  const now = new Date();

  switch (option) {
    case "10m":
      return splitDateTime(addMinutes(now, 10));
    case "30m":
      return splitDateTime(addMinutes(now, 30));
    case "1h":
      return splitDateTime(addHours(now, 1));
    case "tomorrow": {
      const base = parseLocalDate(task.date);
      const next = addDays(base, 1);
      return { date: format(next, "yyyy-MM-dd"), time: task.time ?? "09:00" };
    }
    case "next-week": {
      const base = parseLocalDate(task.date);
      const next = addDays(base, 7);
      return { date: format(next, "yyyy-MM-dd"), time: task.time ?? "09:00" };
    }
    case "custom":
      if (!custom) throw new Error("Custom postpone requires a date and time");
      return custom;
  }
}

function splitDateTime(d: Date): PostponeResult {
  return { date: format(d, "yyyy-MM-dd"), time: format(d, "HH:mm") };
}
