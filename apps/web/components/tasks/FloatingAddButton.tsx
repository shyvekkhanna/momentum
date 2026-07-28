"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useUI } from "@/lib/context/UIContext";

export function FloatingAddButton() {
  const { setCreateTaskOpen } = useUI();

  return (
    <motion.button
      type="button"
      onClick={() => setCreateTaskOpen(true)}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
      whileHover={{ scale: 1.08, rotate: 90 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ring)] text-white shadow-lg shadow-[color-mix(in_srgb,var(--ring)_45%,transparent)] sm:bottom-8 sm:right-8"
      aria-label="Add task"
    >
      <Plus className="h-6 w-6" />
    </motion.button>
  );
}
