"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTasks } from "@/lib/context/TasksContext";
import { suggestEmoji } from "@/lib/ai/emoji";
import { suggestTime } from "@/lib/ai/scheduling";
import { getTasksForDate, todayStr } from "@/lib/tasks/selectors";
import { CATEGORY_META, PRIORITY_META, type Task, type TaskCategory, type Priority } from "@/lib/types/task";

const schema = z.object({
  title: z.string().min(1, "Give it a title").max(120),
  description: z.string().max(500).optional(),
  date: z.string().min(1),
  time: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]),
  estimatedDuration: z.number().int().min(5, "At least 5 min").max(600),
  category: z.string().min(1),
  emoji: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

interface TaskFormProps {
  task?: Task;
  defaultDate?: string;
  onDone?: () => void;
}

export function TaskForm({ task, defaultDate, onDone }: TaskFormProps) {
  const { tasks, addTask, updateTask } = useTasks();
  const isEdit = Boolean(task);
  const [emojiTouched, setEmojiTouched] = useState(isEdit);
  const [suggestionDismissed, setSuggestionDismissed] = useState(false);
  const [aiSuggestedTime, setAiSuggestedTime] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      date: task?.date ?? defaultDate ?? todayStr(),
      time: task?.time ?? "",
      priority: task?.priority ?? "medium",
      estimatedDuration: task?.estimatedDuration ?? 30,
      category: task?.category ?? "personal",
      emoji: task?.emoji ?? "✨",
    },
  });

  const title = watch("title");
  const time = watch("time");
  const date = watch("date");
  const emoji = watch("emoji");

  useEffect(() => {
    if (emojiTouched) return;
    setValue("emoji", suggestEmoji(title || ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  const conflictTasks = useMemo(
    () => getTasksForDate(tasks, date).filter((t) => t.id !== task?.id),
    [tasks, date, task?.id],
  );

  const suggestion = useMemo(() => {
    if (time || suggestionDismissed || !title || title.trim().length < 2) return null;
    return suggestTime(title, conflictTasks);
  }, [title, time, suggestionDismissed, conflictTasks]);

  const acceptSuggestion = () => {
    if (!suggestion) return;
    setValue("time", suggestion.time);
    setValue("estimatedDuration", suggestion.durationMinutes);
    setAiSuggestedTime(true);
  };

  const onSubmit = async (values: FormValues) => {
    const payload = {
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
      date: values.date,
      time: values.time || undefined,
      priority: values.priority as Priority,
      estimatedDuration: values.estimatedDuration,
      category: values.category as TaskCategory,
      emoji: values.emoji,
      aiSuggestedTime,
    };

    if (isEdit && task) {
      await updateTask(task.id, payload);
      toast.success(`${values.emoji} Task updated`);
    } else {
      await addTask(payload);
      toast.success(`${values.emoji} Task added`, { description: values.title });
    }
    onDone?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex gap-3">
        <div className="flex flex-col items-center gap-1.5">
          <Label htmlFor="emoji">Emoji</Label>
          <Input
            id="emoji"
            className="h-11 w-14 text-center text-lg"
            {...register("emoji", {
              onChange: () => setEmojiTouched(true),
            })}
            maxLength={4}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="title">Task name</Label>
          <Input
            id="title"
            placeholder="e.g. Study French"
            autoFocus
            className="mt-1.5"
            {...register("title")}
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          placeholder="Any extra detail…"
          className="mt-1.5"
          {...register("description")}
        />
      </div>

      <AnimatePresence>
        {suggestion && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-2.5 rounded-xl border border-violet-500/20 bg-violet-500/5 p-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
              <div className="flex-1 text-xs">
                <p className="font-medium text-foreground">
                  AI suggests <span className="font-semibold">{suggestion.time}</span> ·{" "}
                  {suggestion.durationMinutes} min
                </p>
                <p className="mt-0.5 text-muted-foreground">{suggestion.reasoning}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={acceptSuggestion}
                  aria-label="Accept suggestion"
                >
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => setSuggestionDismissed(true)}
                  aria-label="Reject suggestion"
                >
                  <X className="h-3.5 w-3.5 text-red-500" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" className="mt-1.5" {...register("date")} />
        </div>
        <div>
          <Label htmlFor="time">Time (optional)</Label>
          <Input
            id="time"
            type="time"
            className="mt-1.5"
            {...register("time", { onChange: () => setAiSuggestedTime(false) })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Priority</Label>
          <Select
            defaultValue={task?.priority ?? "medium"}
            onValueChange={(v) => setValue("priority", v as Priority)}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(PRIORITY_META) as Priority[]).map((p) => (
                <SelectItem key={p} value={p}>
                  {PRIORITY_META[p].emoji} {PRIORITY_META[p].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="estimatedDuration">Duration (min)</Label>
          <Input
            id="estimatedDuration"
            type="number"
            min={5}
            step={5}
            className="mt-1.5"
            {...register("estimatedDuration", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div>
        <Label>Category</Label>
        <Select
          defaultValue={task?.category ?? "personal"}
          onValueChange={(v) => setValue("category", v as TaskCategory)}
        >
          <SelectTrigger className="mt-1.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(CATEGORY_META) as TaskCategory[]).map((c) => (
              <SelectItem key={c} value={c}>
                {CATEGORY_META[c].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" size="lg" className="mt-1" disabled={isSubmitting}>
        {emoji} {isEdit ? "Save changes" : "Add task"}
      </Button>
    </form>
  );
}
