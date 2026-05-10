"use client";

import { motion } from "motion/react";
import { Clock, DollarSign, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const CATEGORY_CONFIG: Record<string, { emoji: string; color: string; bg: string; border: string }> = {
  SIGHTSEEING:   { emoji: "🏛️", color: "text-primary",       bg: "bg-primary/10",       border: "border-primary/20" },
  FOOD:          { emoji: "🍜", color: "text-amber-600",      bg: "bg-amber-500/10",     border: "border-amber-500/20" },
  TRANSPORT:     { emoji: "✈️", color: "text-sky-600",        bg: "bg-sky-500/10",       border: "border-sky-500/20" },
  ACCOMMODATION: { emoji: "🏨", color: "text-violet-600",     bg: "bg-violet-500/10",    border: "border-violet-500/20" },
  ADVENTURE:     { emoji: "🧗", color: "text-orange-600",     bg: "bg-orange-500/10",    border: "border-orange-500/20" },
  CULTURE:       { emoji: "🎭", color: "text-rose-600",       bg: "bg-rose-500/10",      border: "border-rose-500/20" },
  SHOPPING:      { emoji: "🛍️", color: "text-pink-600",       bg: "bg-pink-500/10",      border: "border-pink-500/20" },
  NIGHTLIFE:     { emoji: "🌃", color: "text-indigo-600",     bg: "bg-indigo-500/10",    border: "border-indigo-500/20" },
  WELLNESS:      { emoji: "🧘", color: "text-emerald-600",    bg: "bg-emerald-500/10",   border: "border-emerald-500/20" },
  OTHER:         { emoji: "📌", color: "text-muted-foreground", bg: "bg-muted",          border: "border-border" },
};

export interface ActivityData {
  id: string;
  name: string;
  description: string | null;
  category: string;
  date: Date | null;
  startTime: string | null;
  endTime: string | null;
  cost: number;
  currency: string;
  booked: boolean;
}

interface ActivityBlockProps {
  activity: ActivityData;
  index: number;
  compact?: boolean;
}

export function ActivityBlock({ activity, index, compact = false }: ActivityBlockProps) {
  const cat = CATEGORY_CONFIG[activity.category] ?? CATEGORY_CONFIG.OTHER;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.04 }}
        className={cn(
          "flex items-center gap-2.5 rounded-xl border px-3 py-2 transition-all hover:shadow-sm",
          cat.border, cat.bg,
        )}
      >
        <span className="text-base shrink-0">{cat.emoji}</span>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <p className="truncate text-xs font-semibold text-foreground">{activity.name}</p>
          {activity.startTime && (
            <span className="shrink-0 text-[10px] text-muted-foreground">
              {activity.startTime}
            </span>
          )}
        </div>
        {activity.cost > 0 && (
          <span className="shrink-0 text-[10px] font-medium text-muted-foreground">
            ${activity.cost}
          </span>
        )}
        {activity.booked && (
          <CheckCircle2 className="size-3 shrink-0 text-emerald-500" />
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-4 transition-all hover:shadow-md",
        cat.border, cat.bg,
      )}
    >
      {/* Left accent bar */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl", cat.bg.replace("/10", "/60"))} />

      <div className="flex items-start gap-3 pl-2">
        {/* Icon */}
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl text-xl", cat.bg)}>
          {cat.emoji}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-foreground leading-tight">{activity.name}</p>
            {activity.booked ? (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-2.5" />
                Booked
              </span>
            ) : (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                <Circle className="size-2.5" />
                Pending
              </span>
            )}
          </div>

          {activity.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {activity.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {activity.date && (
              <span className="flex items-center gap-1">
                📅 {format(new Date(activity.date), "MMM d, yyyy")}
              </span>
            )}
            {activity.startTime && (
              <span className="flex items-center gap-1">
                <Clock className="size-3 text-primary" />
                {activity.startTime}
                {activity.endTime && ` – ${activity.endTime}`}
              </span>
            )}
            {activity.cost > 0 && (
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <DollarSign className="size-3 text-primary" />
                {activity.cost.toLocaleString()} {activity.currency}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
