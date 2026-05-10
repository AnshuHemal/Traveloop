"use client";

import { useState, useTransition } from "react";
import { motion } from "motion/react";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { deleteExpense } from "../actions";

const CATEGORY_CONFIG: Record<string, { emoji: string; color: string; bg: string }> = {
  ACCOMMODATION: { emoji: "🏨", color: "text-violet-600", bg: "bg-violet-500/10" },
  FOOD:          { emoji: "🍜", color: "text-amber-600",  bg: "bg-amber-500/10" },
  TRANSPORT:     { emoji: "✈️", color: "text-sky-600",    bg: "bg-sky-500/10" },
  ACTIVITIES:    { emoji: "🎭", color: "text-primary",    bg: "bg-primary/10" },
  SHOPPING:      { emoji: "🛍️", color: "text-pink-600",   bg: "bg-pink-500/10" },
  VISA:          { emoji: "📋", color: "text-orange-600", bg: "bg-orange-500/10" },
  INSURANCE:     { emoji: "🛡️", color: "text-emerald-600", bg: "bg-emerald-500/10" },
  MISC:          { emoji: "📌", color: "text-muted-foreground", bg: "bg-muted" },
};

interface ExpenseRowProps {
  expense: {
    id: string;
    category: string;
    label: string;
    amount: number;
    currency: string;
    date: Date | null;
    notes: string | null;
  };
  tripId: string;
  index: number;
}

export function ExpenseRow({ expense, tripId, index }: ExpenseRowProps) {
  const [isPending, startTransition] = useTransition();
  const cat = CATEGORY_CONFIG[expense.category] ?? CATEGORY_CONFIG.MISC;

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteExpense(expense.id, tripId);
      if (result.error) toast.error(result.error);
      else toast.success("Expense removed");
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12, height: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      layout
      className="group flex items-center gap-3 rounded-xl border border-border bg-background p-3 transition-all hover:border-primary/20 hover:shadow-sm"
    >
      <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg text-base", cat.bg)}>
        {cat.emoji}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-sm font-semibold text-foreground truncate">{expense.label}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className={cn("font-medium", cat.color)}>
            {expense.category.charAt(0) + expense.category.slice(1).toLowerCase()}
          </span>
          {expense.date && (
            <><span>·</span><span>{format(new Date(expense.date), "MMM d, yyyy")}</span></>
          )}
          {expense.notes && (
            <><span>·</span><span className="truncate max-w-32">{expense.notes}</span></>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-foreground">
          ${expense.amount.toLocaleString()}
        </span>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="flex size-7 items-center justify-center rounded-lg text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
        >
          {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
        </button>
      </div>
    </motion.div>
  );
}
