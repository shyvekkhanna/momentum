"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useUI } from "@/lib/context/UIContext";

export function EmptyState() {
  const { setCreateTaskOpen } = useUI();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 22 }}
      className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border py-20 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, -4, 4, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/15 via-violet-500/15 to-pink-500/15 text-4xl"
      >
        🚀
      </motion.div>
      <div>
        <p className="text-lg font-semibold tracking-tight">Let&apos;s make today productive 🚀</p>
        <p className="mt-1 text-sm text-muted-foreground">Nothing on the list yet — add your first task.</p>
      </div>
      <Button onClick={() => setCreateTaskOpen(true)} size="lg">
        Quick add a task
      </Button>
    </motion.div>
  );
}
