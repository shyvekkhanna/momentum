"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { AppShell } from "@/components/layout/AppShell";
import { MonthCalendar } from "@/components/calendar/MonthCalendar";
import { WeekCalendar } from "@/components/calendar/WeekCalendar";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/lib/context/TasksContext";
import { getTasksForDate, todayStr } from "@/lib/tasks/selectors";
import { getWeekdayColor, parseLocalDate } from "@/lib/colors/weekday";
import { useUI } from "@/lib/context/UIContext";
import type { Task } from "@/lib/types/task";

export default function CalendarPage() {
  const { tasks } = useTasks();
  const { setCreateTaskOpen } = useUI();
  const [selected, setSelected] = useState(todayStr());
  const [view, setView] = useState<"month" | "week">("month");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const dayTasks = getTasksForDate(tasks, selected);
  const dayColor = getWeekdayColor(selected);

  return (
    <AppShell accentDate={selected}>
      <div className="flex flex-col gap-6 pb-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Calendar</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Every day has its own colour — today is{" "}
              <span style={{ color: getWeekdayColor(todayStr()).hex }} className="font-medium">
                {getWeekdayColor(todayStr()).name}
              </span>
            </p>
          </div>
          <Tabs value={view} onValueChange={(v) => setView(v as "month" | "week")}>
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {view === "month" ? (
                <MonthCalendar selected={selected} onSelect={setSelected} />
              ) : (
                <WeekCalendar selected={selected} onSelect={setSelected} onEditTask={setEditingTask} />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold" style={{ color: dayColor.hex }}>
                {format(parseLocalDate(selected), "EEEE, MMMM d")}
              </h3>
              <Button size="sm" variant="outline" onClick={() => setCreateTaskOpen(true)}>
                Add task
              </Button>
            </div>
            <AnimatePresence initial={false}>
              {dayTasks.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No tasks on this day.
                </p>
              ) : (
                dayTasks.map((task) => (
                  <motion.div key={task.id} layout>
                    <TaskCard task={task} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
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
