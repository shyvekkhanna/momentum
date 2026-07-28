"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useTasks } from "@/lib/context/TasksContext";
import { suggestEmoji } from "@/lib/ai/emoji";
import { suggestTime } from "@/lib/ai/scheduling";
import { getTasksForDate, todayStr } from "@/lib/tasks/selectors";

export function QuickAdd({ className }: { className?: string }) {
  const { tasks, addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);

    const today = todayStr();
    const emoji = suggestEmoji(trimmed);
    const suggestion = suggestTime(trimmed, getTasksForDate(tasks, today));

    const task = await addTask({
      title: trimmed,
      date: today,
      time: suggestion.time,
      estimatedDuration: suggestion.durationMinutes,
      priority: "medium",
      category: "personal",
      emoji,
      aiSuggestedTime: true,
    });

    toast(`${emoji} ${task.title} scheduled for ${suggestion.time}`, {
      description: suggestion.reasoning,
      icon: <Sparkles className="h-4 w-4 text-violet-500" />,
    });

    setTitle("");
    setSubmitting(false);
  };

  return (
    <motion.form
      onSubmit={submit}
      className={className}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="relative">
        <Plus className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Quick add — try “Study French”…"
          className="h-11 rounded-full pl-10 pr-4 shadow-sm"
        />
      </div>
    </motion.form>
  );
}
