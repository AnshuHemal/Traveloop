"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, DollarSign, TrendingUp, PieChart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BudgetDonut, BudgetBarChart } from "./budget-chart";
import { formatCurrency } from "@/lib/currency";
import { ExpenseRow } from "./expense-row";
import { AddExpenseModal } from "./add-expense-modal";

const CATEGORY_CONFIG: Record<string, { emoji: string; color: string; hex: string }> = {
  ACCOMMODATION: { emoji: "🏨", color: "text-violet-600", hex: "#7c3aed" },
  FOOD:          { emoji: "🍜", color: "text-amber-600",  hex: "#d97706" },
  TRANSPORT:     { emoji: "✈️", color: "text-sky-600",    hex: "#0284c7" },
  ACTIVITIES:    { emoji: "🎭", color: "text-primary",    hex: "#0d9488" },
  SHOPPING:      { emoji: "🛍️", color: "text-pink-600",   hex: "#db2777" },
  VISA:          { emoji: "📋", color: "text-orange-600", hex: "#ea580c" },
  INSURANCE:     { emoji: "🛡️", color: "text-emerald-600", hex: "#059669" },
  MISC:          { emoji: "📌", color: "text-muted-foreground", hex: "#6b7280" },
};

interface Expense {
  id: string;
  category: string;
  label: string;
  amount: number;
  currency: string;
  date: Date | null;
  notes: string | null;
  stop: { cityName: string } | null;
}

interface Stop {
  id: string;
  cityName: string;
  activities: { cost: number }[];
  expenses: Expense[];
}

interface BudgetClientProps {
  tripId: string;
  currency: string;
  stops: Stop[];
}

export function BudgetClient({ tripId, currency, stops }: BudgetClientProps) {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "expenses" | "by-stop">("overview");

  const allExpenses = stops.flatMap((s) =>
    s.expenses.map((e) => ({ ...e, stop: { cityName: s.cityName } })),
  );

  const activityTotal = stops.reduce(
    (acc, s) => acc + s.activities.reduce((a, act) => a + act.cost, 0), 0,
  );

  const expenseTotal = allExpenses.reduce((acc, e) => acc + e.amount, 0);
  const grandTotal = activityTotal + expenseTotal;

  const byCategory: Record<string, number> = {};
  for (const e of allExpenses) {
    byCategory[e.category] = (byCategory[e.category] ?? 0) + e.amount;
  }

  if (activityTotal > 0) byCategory["ACTIVITIES"] = (byCategory["ACTIVITIES"] ?? 0) + activityTotal;

  const donutSlices = Object.entries(byCategory)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([cat, val]) => ({
      label: cat.charAt(0) + cat.slice(1).toLowerCase(),
      value: val,
      color: CATEGORY_CONFIG[cat]?.hex ?? "#6b7280",
      emoji: CATEGORY_CONFIG[cat]?.emoji ?? "📌",
    }));

  const byStop = stops.map((s) => ({
    name: s.cityName,
    activities: s.activities.reduce((acc, a) => acc + a.cost, 0),
    expenses: s.expenses.reduce((acc, e) => acc + e.amount, 0),
    total: s.activities.reduce((acc, a) => acc + a.cost, 0) + s.expenses.reduce((acc, e) => acc + e.amount, 0),
  })).filter((s) => s.total > 0);

  const stopsList = stops.map((s) => ({ id: s.id, cityName: s.cityName }));

  return (
    <>
      {}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: DollarSign, label: "Grand total",    value: formatCurrency(grandTotal,    currency), color: "text-primary",    bg: "bg-primary/10" },
          { icon: TrendingUp, label: "Activities",     value: formatCurrency(activityTotal, currency), color: "text-violet-500", bg: "bg-violet-500/10" },
          { icon: PieChart,   label: "Other expenses", value: formatCurrency(expenseTotal,  currency), color: "text-amber-500",  bg: "bg-amber-500/10" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
          >
            <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", stat.bg)}>
              <stat.icon className={cn("size-5", stat.color)} />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {}
      <div className="flex items-center justify-between gap-4">
        <div className="flex overflow-hidden rounded-xl border border-border bg-muted/30 p-0.5">
          {(["overview", "expenses", "by-stop"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-xs font-medium capitalize transition-all",
                activeTab === tab
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAddExpense(true)}
          className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
        >
          <Plus className="size-4" />
          Add expense
        </button>
      </div>

      {}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-6"
          >
            {}
            <div className="grid gap-6 lg:grid-cols-2">
              {}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="mb-4 font-bold text-foreground">Spending breakdown</h3>
                <BudgetDonut slices={donutSlices} total={grandTotal} currency={currency} />
              </div>

              {}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="mb-4 font-bold text-foreground">By category</h3>
                {donutSlices.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-8 text-center">
                    <span className="text-4xl">💸</span>
                    <p className="text-sm text-muted-foreground">No expenses yet</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {donutSlices.map((slice, i) => {
                      const pct = grandTotal > 0 ? (slice.value / grandTotal) * 100 : 0;
                      return (
                        <div key={slice.label} className="flex items-center gap-3">
                          <span className="text-xl w-7 shrink-0">{slice.emoji}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-foreground">{slice.label}</span>
                              <span className="text-sm font-bold text-foreground">
                                {formatCurrency(slice.value, currency)}
                              </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-muted">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: slice.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.6, delay: 0.2 + i * 0.07, ease: "easeOut" }}
                              />
                            </div>
                          </div>
                          <span className="w-10 shrink-0 text-right text-xs text-muted-foreground">
                            {Math.round(pct)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {}
            {byStop.length > 1 && (
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="mb-4 font-bold text-foreground">Budget by city</h3>
                <BudgetBarChart data={byStop} currency={currency} />
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "expenses" && (
          <motion.div
            key="expenses"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-foreground">All expenses</h3>
              <span className="text-sm text-muted-foreground">{allExpenses.length} items</span>
            </div>
            {allExpenses.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <span className="text-5xl">🧾</span>
                <p className="font-semibold text-foreground">No expenses logged</p>
                <p className="text-sm text-muted-foreground">Track your spending by adding expenses</p>
                <button onClick={() => setShowAddExpense(true)} className={cn(buttonVariants(), "gap-2 mt-2")}>
                  <Plus className="size-4" /> Add first expense
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <AnimatePresence>
                  {allExpenses.map((exp, i) => (
                    <ExpenseRow key={exp.id} expense={exp} tripId={tripId} index={i} />
                  ))}
                </AnimatePresence>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-muted/30 px-4 py-3">
                  <span className="text-sm font-semibold text-foreground">Total expenses</span>
                  <span className="text-base font-bold text-foreground">{formatCurrency(expenseTotal, currency)}</span>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "by-stop" && (
          <motion.div
            key="by-stop"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >
            {byStop.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border py-16 text-center">
                <span className="text-5xl">🗺️</span>
                <p className="font-semibold text-foreground">No budget data yet</p>
                <p className="text-sm text-muted-foreground">Add activities and expenses to see per-stop breakdown</p>
              </div>
            ) : (
              byStop.map((stop, i) => (
                <motion.div
                  key={stop.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-bold text-foreground">{stop.name}</h3>
                    <span className="text-base font-bold text-primary">{formatCurrency(stop.total, currency)}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {stop.activities > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground"><span>🎭</span> Activities</span>
                        <span className="font-medium text-foreground">{formatCurrency(stop.activities, currency)}</span>
                      </div>
                    )}
                    {stop.expenses > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground"><span>🧾</span> Expenses</span>
                        <span className="font-medium text-foreground">{formatCurrency(stop.expenses, currency)}</span>
                      </div>
                    )}
                  </div>
                  {}
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${grandTotal > 0 ? (stop.total / grandTotal) * 100 : 0}%` }}
                      transition={{ duration: 0.6, delay: 0.2 + i * 0.07, ease: "easeOut" }}
                    />
                  </div>
                  <p className="mt-1 text-right text-xs text-muted-foreground">
                    {grandTotal > 0 ? Math.round((stop.total / grandTotal) * 100) : 0}% of total
                  </p>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <AddExpenseModal
        tripId={tripId}
        stops={stopsList}
        open={showAddExpense}
        onClose={() => setShowAddExpense(false)}
      />
    </>
  );
}
