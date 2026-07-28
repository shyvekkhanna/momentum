"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PostponeMenu } from "@/components/tasks/PostponeMenu";
import { TaskForm } from "@/components/tasks/TaskForm";
import { useTasks } from "@/lib/context/TasksContext";
import { useCelebration } from "@/lib/context/CelebrationContext";
import { getWeekdayColor } from "@/lib/colors/weekday";
import { getCountdown, formatDuration } from "@/lib/tasks/countdown";
import { PRIORITY_META, type Task } from "@/lib/types/task";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  className?: string;
}

export function TaskCard({ task, className }: TaskCardProps) {
  const { completeTask, uncompleteTask, deleteTask } = useTasks();
  const { celebrate } = useCelebration();
  const [editOpen, setEditOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (task.completed || !task.time) return;
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, [task.completed, task.time]);

  const dayColor = getWeekdayColor(task.date);
  const countdown = getCountdown(task, now);
  const priority = PRIORITY_META[task.priority];

  const handleToggle = async (e: React.MouseEvent) => {
    if (!task.completed) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      celebrate({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      await completeTask(task.id);
    } else {
      await uncompleteTask(task.id);
    }
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
    toast(`${task.emoji} “${task.title}” deleted`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.18 } }}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className={cn(
        "group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-border bg-card p-3.5 card-shadow transition-shadow hover:shadow-lg",
        task.completed && "opacity-60",
        className,
      )}
      style={{ borderLeft: `4px solid ${dayColor.hex}` }}
    >
      <Checkbox
        checked={task.completed}
        onClick={handleToggle}
        className="shrink-0"
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      />

      <button
        type="button"
        onClick={() => setEditOpen(true)}
        className="flex min-w-0 flex-1 flex-col items-start text-left"
      >
        <div className="flex w-full items-center gap-1.5">
          <span className="text-lg leading-none">{task.emoji}</span>
          <span
            className={cn(
              "truncate text-sm font-medium text-foreground",
              task.completed && "line-through",
            )}
          >
            {task.title}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          {task.time && <span>{task.time}</span>}
          <span>{formatDuration(task.estimatedDuration)}</span>
          <span className="inline-flex items-center gap-0.5">
            {priority.emoji} {priority.label}
          </span>
          {countdown.status !== "none" && (
            <span
              className={cn(
                "font-medium",
                countdown.status === "overdue" && "text-red-500",
                countdown.status === "soon" && "text-amber-500",
              )}
            >
              {countdown.label}
            </span>
          )}
        </div>
      </button>

      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <PostponeMenu task={task} />
        <Button variant="ghost" size="icon-sm" onClick={() => setEditOpen(true)} aria-label="Edit task">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={handleDelete} aria-label="Delete task">
          <Trash2 className="h-3.5 w-3.5 text-red-500" />
        </Button>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
          </DialogHeader>
          <TaskForm task={task} onDone={() => setEditOpen(false)} />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
