"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTasks } from "@/lib/context/TasksContext";
import { getCompletedToday } from "@/lib/tasks/selectors";
import { TaskCard } from "@/components/tasks/TaskCard";

export function CompletedList() {
  const { tasks } = useTasks();
  const completed = getCompletedToday(tasks);

  if (completed.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <h3 className="px-1 text-sm font-semibold">Completed today</h3>
      <AnimatePresence initial={false}>
        {completed.map((task) => (
          <motion.div key={task.id} layout>
            <TaskCard task={task} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
