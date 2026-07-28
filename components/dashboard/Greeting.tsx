"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { useNow } from "@/lib/hooks/useNow";

function greetingParts(hour: number): { text: string; emoji: string } {
  if (hour < 5) return { text: "Still up", emoji: "🌙" };
  if (hour < 12) return { text: "Good Morning", emoji: "☀️" };
  if (hour < 17) return { text: "Good Afternoon", emoji: "🌤️" };
  if (hour < 21) return { text: "Good Evening", emoji: "🌆" };
  return { text: "Good Night", emoji: "🌙" };
}

export function Greeting() {
  const now = useNow();
  const { text, emoji } = greetingParts(now.getHours());

  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {text} {emoji}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{format(now, "EEEE, MMMM d")}</p>
    </motion.div>
  );
}
