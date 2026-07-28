"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTasks } from "@/lib/context/TasksContext";
import { getUpcomingTasks } from "@/lib/tasks/selectors";
import { TaskCard } from "@/components/tasks/TaskCard";

export function UpcomingList() {
  const { tasks } = useTasks();
  const upcoming = getUpcomingTasks(tasks, 6);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="px-1 text-sm font-semibold">Upcoming</h3>
      {upcoming.length === 0 ? (
        <p className="px-1 text-sm text-muted-foreground">Nothing else on the horizon. 🌤️</p>
      ) : (
        <AnimatePresence initial={false}>
          {upcoming.map((task) => (
            <motion.div key={task.id} layout>
              <TaskCard task={task} />
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
