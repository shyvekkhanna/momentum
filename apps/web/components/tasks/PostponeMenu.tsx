"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { Clock3, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MiniCalendar } from "@/components/calendar/MiniCalendar";
import { useTasks } from "@/lib/context/TasksContext";
import { POSTPONE_LABELS, parseLocalDate } from "@momentum/core";
import type { PostponeOption, Task } from "@momentum/types";
import { cn } from "@/lib/utils";

const QUICK_OPTIONS: PostponeOption[] = ["10m", "30m", "1h", "tomorrow", "next-week"];

export function PostponeMenu({ task, trigger }: { task: Task; trigger?: React.ReactNode }) {
  const { postponeTask } = useTasks();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"menu" | "custom">("menu");
  const [customDate, setCustomDate] = useState(task.date);
  const [customTime, setCustomTime] = useState(task.time ?? "09:00");

  const choose = async (option: PostponeOption) => {
    await postponeTask(task.id, option);
    toast.success(`${task.emoji} ${task.title} postponed`, {
      description: `Moved by ${POSTPONE_LABELS[option].toLowerCase()}`,
    });
    setOpen(false);
    setView("menu");
  };

  const confirmCustom = async () => {
    await postponeTask(task.id, "custom", { date: customDate, time: customTime });
    toast.success(`${task.emoji} ${task.title} postponed`, {
      description: `Moved to ${format(parseLocalDate(customDate), "MMM d")} at ${customTime}`,
    });
    setOpen(false);
    setView("menu");
  };

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setView("menu");
      }}
    >
      <PopoverTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="icon-sm" aria-label="Postpone task">
            <Clock3 className="h-3.5 w-3.5" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className={cn("p-2", view === "custom" && "w-80 p-4")} align="end">
        <AnimatePresence mode="wait" initial={false}>
          {view === "menu" ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-0.5"
            >
              <p className="px-2 pb-1.5 pt-1 text-xs font-semibold text-muted-foreground">
                Postpone task
              </p>
              {QUICK_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => choose(opt)}
                  className="flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-black/[0.05] dark:hover:bg-white/[0.08]"
                >
                  {POSTPONE_LABELS[opt]}
                </button>
              ))}
              <button
                onClick={() => setView("custom")}
                className="flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-black/[0.05] dark:hover:bg-white/[0.08]"
              >
                Custom date & time
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="custom"
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-3"
            >
              <MiniCalendar value={customDate} onChange={setCustomDate} />
              <Input
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={() => setView("menu")}>
                  Back
                </Button>
                <Button size="sm" onClick={confirmCustom}>
                  Postpone
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
}
