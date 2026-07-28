"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useCountUp } from "@/lib/hooks/useCountUp";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  accent?: string;
  delay?: number;
}

export function StatCard({ icon: Icon, label, value, suffix, accent, delay = 0 }: StatCardProps) {
  const animated = useCountUp(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -2 }}
    >
      <Card className="flex items-center gap-3 p-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accent ?? "#3358E8"}1f`, color: accent ?? "#3358E8" }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xl font-semibold tabular-nums leading-none">
            {animated}
            {suffix}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </div>
      </Card>
    </motion.div>
  );
}
