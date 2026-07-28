"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog as EditDialog, DialogContent as EditDialogContent, DialogHeader as EditDialogHeader, DialogTitle as EditDialogTitle } from "@/components/ui/dialog";
import { TaskForm } from "@/components/tasks/TaskForm";
import { useTasks } from "@/lib/context/TasksContext";
import { useUI } from "@/lib/context/UIContext";
import { WEEKDAY_COLORS, getWeekdayColor, parseLocalDate, formatDuration } from "@momentum/core";
import { PRIORITY_META, CATEGORY_META, type Priority, type TaskCategory, type Task } from "@momentum/types";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal } from "lucide-react";
import { format } from "date-fns";

type CompletedFilter = "all" | "active" | "completed";

function toggleSetValue<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUI();
  const { tasks } = useTasks();
  const [query, setQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<Set<Priority>>(new Set());
  const [weekdayFilter, setWeekdayFilter] = useState<Set<number>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState<Set<TaskCategory>>(new Set());
  const [completedFilter, setCompletedFilter] = useState<CompletedFilter>("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks
      .filter((t) => {
        if (q) {
          const hay = `${t.emoji} ${t.title} ${t.description ?? ""} ${CATEGORY_META[t.category].label}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (priorityFilter.size && !priorityFilter.has(t.priority)) return false;
        if (categoryFilter.size && !categoryFilter.has(t.category)) return false;
        if (weekdayFilter.size && !weekdayFilter.has(parseLocalDate(t.date).getDay())) return false;
        if (completedFilter === "active" && t.completed) return false;
        if (completedFilter === "completed" && !t.completed) return false;
        return true;
      })
      .sort((a, b) => (a.date + (a.time ?? "")).localeCompare(b.date + (b.time ?? "")))
      .slice(0, 40);
  }, [tasks, query, priorityFilter, weekdayFilter, categoryFilter, completedFilter]);

  const hasActiveFilters = priorityFilter.size > 0 || weekdayFilter.size > 0 || categoryFilter.size > 0;

  const close = (v: boolean) => {
    setCommandPaletteOpen(v);
    if (!v) setQuery("");
  };

  return (
    <>
      <Dialog open={commandPaletteOpen} onOpenChange={close}>
        <DialogContent className="max-w-2xl gap-0 p-0">
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks…"
              className="h-auto border-none bg-transparent p-0 shadow-none focus-visible:ring-0"
            />
            <Button
              type="button"
              variant={hasActiveFilters ? "primary" : "ghost"}
              size="icon-sm"
              onClick={() => setShowFilters((s) => !s)}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </Button>
          </div>

          {showFilters && (
            <div className="flex flex-col gap-3 border-b border-border px-4 py-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {(["all", "active", "completed"] as CompletedFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setCompletedFilter(f)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                      completedFilter === f
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                        : "bg-muted text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {(Object.keys(PRIORITY_META) as Priority[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriorityFilter((s) => toggleSetValue(s, p))}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                      priorityFilter.has(p)
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                        : "bg-muted text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {PRIORITY_META[p].emoji} {PRIORITY_META[p].label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {WEEKDAY_COLORS.map((wd) => (
                  <button
                    key={wd.index}
                    onClick={() => setWeekdayFilter((s) => toggleSetValue(s, wd.index))}
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold transition-all",
                      weekdayFilter.has(wd.index) ? "text-white ring-2 ring-offset-2 ring-offset-card" : "text-muted-foreground",
                    )}
                    style={{
                      backgroundColor: weekdayFilter.has(wd.index) ? wd.hex : `rgb(${wd.rgb} / 0.12)`,
                    }}
                  >
                    {wd.short[0]}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {(Object.keys(CATEGORY_META) as TaskCategory[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategoryFilter((s) => toggleSetValue(s, c))}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                      categoryFilter.has(c)
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                        : "bg-muted text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {CATEGORY_META[c].label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="max-h-80 overflow-y-auto p-2">
            {results.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">No matching tasks.</p>
            ) : (
              results.map((t) => {
                const color = getWeekdayColor(t.date);
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setEditingTask(t);
                      close(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  >
                    <span className="text-base">{t.emoji}</span>
                    <span className={cn("min-w-0 flex-1 truncate", t.completed && "text-muted-foreground line-through")}>
                      {t.title}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[11px] font-medium text-white"
                      style={{ backgroundColor: color.hex }}
                    >
                      {format(parseLocalDate(t.date), "MMM d")}
                    </span>
                    {t.time && <span className="text-xs text-muted-foreground">{t.time}</span>}
                    <span className="text-xs text-muted-foreground">{formatDuration(t.estimatedDuration)}</span>
                  </button>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      <EditDialog open={Boolean(editingTask)} onOpenChange={(v) => !v && setEditingTask(null)}>
        <EditDialogContent>
          <EditDialogHeader>
            <EditDialogTitle>Edit task</EditDialogTitle>
          </EditDialogHeader>
          {editingTask && <TaskForm task={editingTask} onDone={() => setEditingTask(null)} />}
        </EditDialogContent>
      </EditDialog>
    </>
  );
}
