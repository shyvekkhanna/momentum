"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ListTodo } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Greeting } from "@/components/dashboard/Greeting";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { StatCard } from "@/components/dashboard/StatCard";
import { TimelineView } from "@/components/dashboard/TimelineView";
import { AISuggestions } from "@/components/dashboard/AISuggestions";
import { UpcomingList } from "@/components/dashboard/UpcomingList";
import { CompletedList } from "@/components/dashboard/CompletedList";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { QuickAdd } from "@/components/tasks/QuickAdd";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TaskForm } from "@/components/tasks/TaskForm";
import { useTasks } from "@/lib/context/TasksContext";
import { computeCompletionStats, todayStr } from "@/lib/tasks/selectors";
import { getWeekdayColor } from "@/lib/colors/weekday";
import type { Task } from "@/lib/types/task";

export default function DashboardPage() {
  const { tasks } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const today = todayStr();
  const stats = computeCompletionStats(tasks, today);
  const dayColor = getWeekdayColor(today);

  return (
    <AppShell accentDate={today}>
      <div className="flex flex-col gap-6 pb-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <Greeting />
          <QuickAdd className="w-full sm:w-80" />
        </div>

        {tasks.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="grid grid-cols-1 gap-3 sm:grid-cols-[auto_1fr_1fr]"
            >
              <Card className="flex items-center gap-4 p-4">
                <ProgressRing percent={stats.percent} color={dayColor.hex} />
                <div>
                  <p className="text-sm font-semibold">Today&apos;s progress</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.completed} of {stats.total} tasks done
                  </p>
                </div>
              </Card>
              <StatCard
                icon={ListTodo}
                label="Tasks remaining"
                value={stats.remaining}
                accent={dayColor.hex}
                delay={0.05}
              />
              <StatCard
                icon={CheckCircle2}
                label="Completed today"
                value={stats.completed}
                accent="#17A673"
                delay={0.1}
              />
            </motion.div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
              <div className="flex flex-col gap-4">
                <h3 className="px-1 text-sm font-semibold">Today&apos;s timeline</h3>
                <TimelineView date={today} onEdit={setEditingTask} />
              </div>
              <div className="flex flex-col gap-6">
                <AISuggestions />
                <UpcomingList />
              </div>
            </div>

            <CompletedList />
          </>
        )}
      </div>

      <Dialog open={Boolean(editingTask)} onOpenChange={(v) => !v && setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
          </DialogHeader>
          {editingTask && <TaskForm task={editingTask} onDone={() => setEditingTask(null)} />}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
