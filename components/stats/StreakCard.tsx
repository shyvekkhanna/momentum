"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useCountUp } from "@/lib/hooks/useCountUp";

export function StreakCard({ current, longest }: { current: number; longest: number }) {
  const animatedCurrent = useCountUp(current);
  const animatedLongest = useCountUp(longest);

  return (
    <Card className="relative overflow-hidden p-5">
      <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-orange-500/10 blur-2xl" />
      <div className="relative flex items-center gap-4">
        <motion.div
          animate={current > 0 ? { scale: [1, 1.12, 1] } : {}}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-lg shadow-orange-500/30"
        >
          <Flame className="h-6 w-6" />
        </motion.div>
        <div>
          <p className="text-2xl font-semibold tabular-nums leading-none">{animatedCurrent}d</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Current streak · longest {animatedLongest}d
          </p>
        </div>
      </div>
    </Card>
  );
}
