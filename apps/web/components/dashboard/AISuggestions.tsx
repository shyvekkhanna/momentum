"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/lib/context/TasksContext";
import { suggestTime, getTasksForDate, todayStr } from "@momentum/core";

export function AISuggestions() {
  const { tasks, updateTask } = useTasks();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const today = todayStr();

  const candidates = useMemo(
    () =>
      tasks
        .filter((t) => !t.completed && !t.time && t.date >= today && !dismissed.has(t.id))
        .slice(0, 3),
    [tasks, today, dismissed],
  );

  if (candidates.length === 0) return null;

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-violet-500" />
        <h3 className="text-sm font-semibold">AI suggestions</h3>
      </div>
      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {candidates.map((task) => {
            const suggestion = suggestTime(task.title, getTasksForDate(tasks, task.date));
            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-2.5 rounded-xl bg-muted/60 p-3">
                  <span className="text-lg leading-none">{task.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{task.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Suggested <span className="font-medium text-foreground">{suggestion.time}</span> ·{" "}
                      {suggestion.durationMinutes} min — {suggestion.reasoning}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Accept"
                      onClick={async () => {
                        await updateTask(task.id, {
                          time: suggestion.time,
                          estimatedDuration: suggestion.durationMinutes,
                          aiSuggestedTime: true,
                        });
                        toast.success(`${task.emoji} Scheduled for ${suggestion.time}`);
                      }}
                    >
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Reject"
                      onClick={() => setDismissed((s) => new Set(s).add(task.id))}
                    >
                      <X className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Card>
  );
}
