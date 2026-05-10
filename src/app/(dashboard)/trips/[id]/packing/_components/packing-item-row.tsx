"use client";

import { useState, useTransition } from "react";
import { motion } from "motion/react";
import { Trash2, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { toggleItemPacked, deletePackingItem } from "../actions";

const CATEGORY_CONFIG: Record<string, { emoji: string; color: string }> = {
  DOCUMENTS:    { emoji: "📋", color: "text-sky-600" },
  CLOTHING:     { emoji: "👕", color: "text-violet-600" },
  ELECTRONICS:  { emoji: "🔌", color: "text-amber-600" },
  TOILETRIES:   { emoji: "🧴", color: "text-emerald-600" },
  HEALTH:       { emoji: "💊", color: "text-rose-600" },
  MONEY:        { emoji: "💳", color: "text-primary" },
  ENTERTAINMENT:{ emoji: "🎮", color: "text-indigo-600" },
  FOOD_SNACKS:  { emoji: "🍫", color: "text-orange-600" },
  OTHER:        { emoji: "📦", color: "text-muted-foreground" },
};

interface PackingItemRowProps {
  item: {
    id: string;
    name: string;
    category: string;
    packed: boolean;
    essential: boolean;
    quantity: number;
    notes: string | null;
  };
  tripId: string;
  index: number;
}

export function PackingItemRow({ item, tripId, index }: PackingItemRowProps) {
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<"toggle" | "delete" | null>(null);
  const cat = CATEGORY_CONFIG[item.category] ?? CATEGORY_CONFIG.OTHER;

  function handleToggle() {
    setPendingAction("toggle");
    startTransition(async () => {
      const result = await toggleItemPacked(item.id, tripId, !item.packed);
      if (result.error) toast.error(result.error);
      setPendingAction(null);
    });
  }

  function handleDelete() {
    setPendingAction("delete");
    startTransition(async () => {
      const result = await deletePackingItem(item.id, tripId);
      if (result.error) toast.error(result.error);
      else toast.success(`"${item.name}" removed`);
      setPendingAction(null);
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      layout
      className={cn(
        "group flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-all duration-200",
        item.packed
          ? "border-border/50 bg-muted/30"
          : "border-border bg-background hover:border-primary/20 hover:shadow-sm",
      )}
    >
      {/* Custom checkbox */}
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200",
          item.packed
            ? "border-primary bg-primary"
            : "border-border hover:border-primary",
        )}
        aria-label={item.packed ? "Mark as unpacked" : "Mark as packed"}
      >
        {pendingAction === "toggle" ? (
          <Loader2 className="size-3 animate-spin text-primary-foreground" />
        ) : item.packed ? (
          <motion.svg
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="size-3 text-primary-foreground"
            viewBox="0 0 12 12" fill="none"
          >
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        ) : null}
      </button>

      {/* Category emoji */}
      <span className="text-base shrink-0">{cat.emoji}</span>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm font-medium transition-all",
            item.packed ? "line-through text-muted-foreground" : "text-foreground",
          )}>
            {item.name}
          </span>
          {item.essential && !item.packed && (
            <Star className="size-3 shrink-0 fill-amber-400 text-amber-400" />
          )}
          {item.quantity > 1 && (
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              ×{item.quantity}
            </span>
          )}
        </div>
        {item.notes && !item.packed && (
          <p className="text-xs text-muted-foreground truncate">{item.notes}</p>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
      >
        {pendingAction === "delete" ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Trash2 className="size-3.5" />
        )}
      </button>
    </motion.div>
  );
}
