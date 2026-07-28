import type { Task } from "@momentum/types";

export interface TimeSuggestion {
  time: string; // HH:mm
  durationMinutes: number;
  reasoning: string;
}

interface HeuristicRule {
  keywords: string[];
  time: string;
  durationMinutes: number;
  reasoning: string;
}

/**
 * Heuristic "AI" scheduler: when a task has no explicit time, infer a
 * sensible slot and duration from its title, then nudge past any conflict
 * with the day's existing tasks. Isolated so it can be swapped for a real
 * model call later — everything talks to `suggestTime(...)`.
 */
const RULES: HeuristicRule[] = [
  {
    keywords: ["french", "spanish", "german", "japanese", "study", "learn", "read", "reading"],
    time: "19:00",
    durationMinutes: 30,
    reasoning: "Language and study sessions stick best in a relaxed evening slot.",
  },
  {
    keywords: ["workout", "gym", "run", "running", "exercise", "yoga", "swim"],
    time: "07:00",
    durationMinutes: 45,
    reasoning: "Morning workouts benefit from fresh energy before the day fills up.",
  },
  {
    keywords: ["meeting", "call", "standup", "sync", "client", "presentation"],
    time: "10:00",
    durationMinutes: 30,
    reasoning: "Mid-morning is typically the most alert window for meetings.",
  },
  {
    keywords: ["meditate", "meditation", "mindfulness"],
    time: "07:30",
    durationMinutes: 15,
    reasoning: "A short morning reset works well before the day gets busy.",
  },
  {
    keywords: ["grocery", "groceries", "shopping", "errand"],
    time: "17:30",
    durationMinutes: 40,
    reasoning: "After-work hours avoid daytime store crowds.",
  },
  {
    keywords: ["cook", "dinner", "cooking"],
    time: "18:30",
    durationMinutes: 45,
    reasoning: "Scheduled right around typical dinner time.",
  },
  {
    keywords: ["email", "inbox", "admin"],
    time: "09:00",
    durationMinutes: 20,
    reasoning: "Clearing admin first thing keeps the rest of the day clear.",
  },
  {
    keywords: ["clean", "cleaning", "laundry", "tidy"],
    time: "11:00",
    durationMinutes: 30,
    reasoning: "Late morning is a natural lull for household chores.",
  },
];

const DEFAULT_SUGGESTION: Omit<TimeSuggestion, "time"> = {
  durationMinutes: 30,
  reasoning: "No strong signal from the title, so this defaults to a flexible mid-morning slot.",
};

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(mins: number): string {
  const wrapped = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function overlaps(
  startA: number,
  durA: number,
  startB: number,
  durB: number,
): boolean {
  const endA = startA + durA;
  const endB = startB + durB;
  return startA < endB && startB < endA;
}

export function suggestTime(
  title: string,
  existingTasksOnDate: Pick<Task, "time" | "estimatedDuration">[] = [],
): TimeSuggestion {
  const normalized = title.toLowerCase();
  const matched = RULES.find((rule) =>
    rule.keywords.some((kw) => normalized.includes(kw)),
  );

  const base: TimeSuggestion = matched
    ? { time: matched.time, durationMinutes: matched.durationMinutes, reasoning: matched.reasoning }
    : { time: "09:00", ...DEFAULT_SUGGESTION };

  // Nudge forward in 15-minute steps until it stops colliding with the day.
  let candidateStart = timeToMinutes(base.time);
  const busy = existingTasksOnDate
    .filter((t) => t.time)
    .map((t) => ({
      start: timeToMinutes(t.time as string),
      dur: t.estimatedDuration || 30,
    }));

  let guard = 0;
  while (
    busy.some((b) => overlaps(candidateStart, base.durationMinutes, b.start, b.dur)) &&
    guard < 48
  ) {
    candidateStart += 15;
    guard += 1;
  }

  return {
    ...base,
    time: minutesToTime(candidateStart),
    reasoning:
      guard > 0
        ? `${base.reasoning} Shifted slightly to avoid a scheduling conflict.`
        : base.reasoning,
  };
}
