"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { DollarSign, TrendingUp, ArrowRight, PieChart } from "lucide-react";

interface BudgetHighlightsProps {
  trips: {
    id: string;
    title: string;
    currency: string;
    stops: {
      activities: { cost: number; currency: string }[];
      expenses: { amount: number; category: string }[];
    }[];
  }[];
}

const CATEGORY_COLORS: Record<string, string> = {
  ACCOMMODATION: "bg-primary",
  FOOD:          "bg-emerald-500",
  TRANSPORT:     "bg-violet-500",
  ACTIVITIES:    "bg-amber-500",
  SHOPPING:      "bg-rose-500",
  MISC:          "bg-muted-foreground",
};

const CATEGORY_LABELS: Record<string, string> = {
  ACCOMMODATION: "Accommodation",
  FOOD:          "Food",
  TRANSPORT:     "Transport",
  ACTIVITIES:    "Activities",
  SHOPPING:      "Shopping",
  MISC:          "Other",
};

function calcTripBudget(trip: BudgetHighlightsProps["trips"][0]) {
  let total = 0;
  const byCategory: Record<string, number> = {};

  for (const stop of trip.stops) {
    for (const act of stop.activities) {
      total += act.cost;
      byCategory["ACTIVITIES"] = (byCategory["ACTIVITIES"] ?? 0) + act.cost;
    }
    for (const exp of stop.expenses) {
      total += exp.amount;
      byCategory[exp.category] = (byCategory[exp.category] ?? 0) + exp.amount;
    }
  }

  return { total, byCategory };
}

export function BudgetHighlights({ trips }: BudgetHighlightsProps) {
  if (trips.length === 0) return null;

  const tripsWithBudget = trips
    .map((t) => ({ ...t, ...calcTripBudget(t) }))
    .filter((t) => t.total > 0)
    .sort((a, b) => b.total - a.total);

  if (tripsWithBudget.length === 0) return null;

  const featured = tripsWithBudget[0];
  const totalAllTrips = tripsWithBudget.reduce((acc, t) => acc + t.total, 0);

  const categories = Object.entries(featured.byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <PieChart className="size-4 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Budget Highlights</h2>
        </div>
        <Link
          href={`/trips/${featured.id}/budget`}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Full report
          <ArrowRight className="size-3.5" />
        </Link>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3">
        {}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="col-span-1 rounded-2xl border border-border bg-card p-5"
        >
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <DollarSign className="size-5 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Total tracked</p>
          <p className="mt-0.5 text-2xl font-bold text-foreground">
            ${totalAllTrips.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            across {tripsWithBudget.length} trip{tripsWithBudget.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="col-span-1 sm:col-span-2 rounded-2xl border border-border bg-card p-5"
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Top trip budget</p>
              <p className="font-semibold text-foreground line-clamp-1">{featured.title}</p>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-primary">
              <TrendingUp className="size-4" />
              ${featured.total.toLocaleString()}
            </div>
          </div>

          {}
          <div className="flex flex-col gap-2.5">
            {categories.map(([cat, amount], i) => {
              const pct = featured.total > 0 ? (amount / featured.total) * 100 : 0;
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-xs text-muted-foreground truncate">
                    {CATEGORY_LABELS[cat] ?? cat}
                  </span>
                  <div className="flex-1 overflow-hidden rounded-full bg-muted h-2">
                    <motion.div
                      className={`h-full rounded-full ${CATEGORY_COLORS[cat] ?? "bg-primary"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: "easeOut" }}
                    />
                  </div>
                  <span className="w-14 shrink-0 text-right text-xs font-medium text-foreground">
                    ${amount.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
