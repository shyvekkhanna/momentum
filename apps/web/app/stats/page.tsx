"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ListChecks, Percent } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { StreakCard } from "@/components/stats/StreakCard";
import { WeekdayChart } from "@/components/stats/WeekdayChart";
import { ProductiveHoursChart } from "@/components/stats/ProductiveHoursChart";
import { Heatmap } from "@/components/stats/Heatmap";
import { SummaryCard } from "@/components/stats/SummaryCard";
import { useTasks } from "@/lib/context/TasksContext";
import {
  computeHeatmap,
  computeMostProductiveHours,
  computeOverallCompletionRate,
  computeRangeSummary,
  computeStreak,
  computeTasksPerWeekday,
  todayStr,
  getWeekdayColor,
} from "@momentum/core";

export default function StatsPage() {
  const { tasks } = useTasks();

  const streak = computeStreak(tasks);
  const overallRate = computeOverallCompletionRate(tasks);
  const totalCompleted = tasks.filter((t) => t.completed).length;
  const weekdayCounts = computeTasksPerWeekday(tasks);
  const hourCounts = computeMostProductiveHours(tasks);
  const heatmapDays = computeHeatmap(tasks);
  const weekSummary = computeRangeSummary(tasks, new Date(), "week");
  const monthSummary = computeRangeSummary(tasks, new Date(), "month");
  const todayColor = getWeekdayColor(todayStr());

  return (
    <AppShell>
      <div className="flex flex-col gap-6 pb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Statistics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your productivity, visualised.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          <StreakCard current={streak.current} longest={streak.longest} />
          <StatCard icon={CheckCircle2} label="Tasks completed" value={totalCompleted} accent="#17A673" delay={0.05} />
          <StatCard icon={Percent} label="Completion rate" value={overallRate} suffix="%" accent={todayColor.hex} delay={0.1} />
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <WeekdayChart counts={weekdayCounts} />
          <ProductiveHoursChart counts={hourCounts} />
        </div>

        <Heatmap days={heatmapDays} />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <SummaryCard title="This week" stats={weekSummary} color={todayColor.hex} />
          <SummaryCard title="This month" stats={monthSummary} color={todayColor.hex} />
        </div>

        {tasks.length === 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            <ListChecks className="h-4 w-4" />
            Stats will fill in as you complete tasks.
          </div>
        )}
      </div>
    </AppShell>
  );
}
