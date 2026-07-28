export type Priority = "low" | "medium" | "high" | "critical";

export const PRIORITY_META: Record<
  Priority,
  { label: string; emoji: string; order: number }
> = {
  low: { label: "Low", emoji: "🟢", order: 0 },
  medium: { label: "Medium", emoji: "🟡", order: 1 },
  high: { label: "High", emoji: "🟠", order: 2 },
  critical: { label: "Critical", emoji: "🔴", order: 3 },
};

export type TaskCategory =
  | "work"
  | "health"
  | "personal"
  | "errands"
  | "learning"
  | "home"
  | "social"
  | "finance"
  | "travel"
  | "other";

export const CATEGORY_META: Record<TaskCategory, { label: string }> = {
  work: { label: "Work" },
  health: { label: "Health" },
  personal: { label: "Personal" },
  errands: { label: "Errands" },
  learning: { label: "Learning" },
  home: { label: "Home" },
  social: { label: "Social" },
  finance: { label: "Finance" },
  travel: { label: "Travel" },
  other: { label: "Other" },
};

export interface Task {
  id: string;
  title: string;
  description?: string;
  emoji: string;
  date: string; // yyyy-MM-dd
  time?: string; // HH:mm, optional until scheduled
  aiSuggestedTime?: boolean;
  priority: Priority;
  estimatedDuration: number; // minutes
  category: TaskCategory;
  completed: boolean;
  createdAt: string; // ISO timestamp
  completedAt?: string; // ISO timestamp
  reminderSentAt?: string;
  postponedFrom?: {
    date: string;
    time?: string;
  };
}

export type NewTaskInput = Omit<
  Task,
  "id" | "createdAt" | "completed" | "completedAt" | "emoji"
> & {
  emoji?: string;
};

export type PostponeOption =
  | "10m"
  | "30m"
  | "1h"
  | "tomorrow"
  | "next-week"
  | "custom";
