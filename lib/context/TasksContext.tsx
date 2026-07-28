"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { NewTaskInput, PostponeOption, Task } from "@/lib/types/task";
import { taskRepository } from "@/lib/storage/taskRepository";
import { suggestEmoji } from "@/lib/ai/emoji";
import { computePostponedDateTime } from "@/lib/tasks/postpone";
import { useTaskReminders } from "@/lib/notifications/useTaskReminders";

interface TasksContextValue {
  tasks: Task[];
  loading: boolean;
  addTask: (input: NewTaskInput) => Promise<Task>;
  updateTask: (id: string, patch: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  uncompleteTask: (id: string) => Promise<void>;
  postponeTask: (
    id: string,
    option: PostponeOption,
    custom?: { date: string; time: string },
  ) => Promise<void>;
}

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taskRepository.getAll().then((loaded) => {
      setTasks(loaded);
      setLoading(false);
    });
  }, []);

  const addTask = useCallback(async (input: NewTaskInput) => {
    const emoji = input.emoji || suggestEmoji(input.title);
    const task = await taskRepository.create({ ...input, emoji });
    setTasks((prev) => [...prev, task]);
    return task;
  }, []);

  const updateTask = useCallback(async (id: string, patch: Partial<Task>) => {
    const updated = await taskRepository.update(id, patch);
    if (updated) {
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await taskRepository.remove(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const completeTask = useCallback(
    async (id: string) => {
      await updateTask(id, { completed: true, completedAt: new Date().toISOString() });
    },
    [updateTask],
  );

  const uncompleteTask = useCallback(
    async (id: string) => {
      await updateTask(id, { completed: false, completedAt: undefined });
    },
    [updateTask],
  );

  const postponeTask = useCallback(
    async (id: string, option: PostponeOption, custom?: { date: string; time: string }) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const { date, time } = computePostponedDateTime(task, option, custom);
      await updateTask(id, {
        date,
        time,
        reminderSentAt: undefined,
        postponedFrom: { date: task.date, time: task.time },
      });
    },
    [tasks, updateTask],
  );

  const markReminderSent = useCallback((id: string, sentAt: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, reminderSentAt: sentAt } : t)));
    taskRepository.update(id, { reminderSentAt: sentAt });
  }, []);

  useTaskReminders(tasks, markReminderSent);

  const value = useMemo<TasksContextValue>(
    () => ({
      tasks,
      loading,
      addTask,
      updateTask,
      deleteTask,
      completeTask,
      uncompleteTask,
      postponeTask,
    }),
    [tasks, loading, addTask, updateTask, deleteTask, completeTask, uncompleteTask, postponeTask],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within a TasksProvider");
  return ctx;
}
