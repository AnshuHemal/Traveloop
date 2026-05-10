"use client";

import { motion } from "motion/react";
import { DollarSign, TrendingUp, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<string, string> = {
  SIGHTSEEING:   "Sightseeing",
  FOOD:          "Food",
  TRANSPORT:     "Transport",
  ACCOMMODATION: "Accommodation",
  ADVENTURE:     "Adventure",
  CULTURE:       "Culture",
  SHOPPING:      "Shopping",
  NIGHTLIFE:     "Nightlife",
  WELLNESS:      "Wellness",
  OTHER:         "Other",
};

const CATEGORY_COLORS: Record<string, string> = {
  SIGHTSEEING:   "bg-primary",
  FOOD:          "bg-amber-500",
  TRANSPORT:     "bg-sky-500",
  ACCOMMODATION: "bg-violet-500",
  ADVENTURE:     "bg-orange-500",
  CULTURE:       "bg-rose-500",
  SHOPPING:      "bg-pink-500",
  NIGHTLIFE:     "bg-indigo-500",
  WELLNESS:      "bg-emerald-500",
  OTHER:         "bg-muted-foreground",
};

interface Activity {
  cost: number;
  category: string;
}

interface Stop {
  cityName: string;
  activities: Activity[];
}

interface BudgetSummaryProps {
  stops: Stop[];
  currency: string;
}

export function BudgetSummary({ stops, currency }: BudgetSummaryProps) {

  const byCategory: Record<string, number> = {};
  let total = 0;

  for (const stop of stops) {
    for (const act of stop.activities) {
      if (act.cost > 0) {
        byCategory[act.category] = (byCategory[act.category] ?? 0) + act.cost;
        total += act.cost;
      }
    }
  }

  const categories = Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  const stopTotals = stops
    .map((s) => ({
      name: s.cityName,
      total: s.activities.reduce((acc, a) => acc + a.cost, 0),
    }))
    .filter((s) => s.total > 0)
    .sort((a, b) => b.total - a.total);

  if (total === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
    >
      {}
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
          <PieChart className="size-4 text-primary" />
        </div>
        <h3 className="font-bold text-foreground">Budget Summary</h3>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {}
        <div className="flex items-center justify-between rounded-xl bg-primary/8 border border-primary/20 px-4 py-3">
          <div className="flex items-center gap-2">
            <DollarSign className="size-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Total estimated</span>
          </div>
          <span className="text-lg font-bold text-primary">
            {currency} {total.toLocaleString()}
          </span>
        </div>

        {}
        {categories.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              By category
            </p>
            {categories.map(([cat, amount], i) => {
              const pct = total > 0 ? (amount / total) * 100 : 0;
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-xs text-muted-foreground truncate">
                    {CATEGORY_LABELS[cat] ?? cat}
                  </span>
                  <div className="flex-1 overflow-hidden rounded-full bg-muted h-2">
                    <motion.div
                      className={cn("h-full rounded-full", CATEGORY_COLORS[cat] ?? "bg-primary")}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.2 + i * 0.07, ease: "easeOut" }}
                    />
                  </div>
                  <span className="w-16 shrink-0 text-right text-xs font-medium text-foreground">
                    {currency} {amount.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {}
        {stopTotals.length > 1 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              By city
            </p>
            {stopTotals.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground truncate">{s.name}</span>
                <span className="font-medium text-foreground shrink-0 ml-2">
                  {currency} {s.total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
