"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock, DollarSign, Trash2, CheckCircle2,
  Circle, Loader2, Calendar, Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { deleteActivity, toggleActivityBooked } from "../actions";
import { EditActivityModal } from "./edit-activity-modal";
import { format } from "date-fns";

const CATEGORY_CONFIG: Record<string, { emoji: string; color: string; bg: string }> = {
  SIGHTSEEING:   { emoji: "🏛️", color: "text-primary",            bg: "bg-primary/10" },
  FOOD:          { emoji: "🍜", color: "text-amber-600",           bg: "bg-amber-500/10" },
  TRANSPORT:     { emoji: "✈️", color: "text-sky-600",             bg: "bg-sky-500/10" },
  ACCOMMODATION: { emoji: "🏨", color: "text-violet-600",          bg: "bg-violet-500/10" },
  ADVENTURE:     { emoji: "🧗", color: "text-orange-600",          bg: "bg-orange-500/10" },
  CULTURE:       { emoji: "🎭", color: "text-rose-600",            bg: "bg-rose-500/10" },
  SHOPPING:      { emoji: "🛍️", color: "text-pink-600",            bg: "bg-pink-500/10" },
  NIGHTLIFE:     { emoji: "🌃", color: "text-indigo-600",          bg: "bg-indigo-500/10" },
  WELLNESS:      { emoji: "🧘", color: "text-emerald-600",         bg: "bg-emerald-500/10" },
  OTHER:         { emoji: "📌", color: "text-muted-foreground",    bg: "bg-muted" },
};

interface ActivityItemProps {
  activity: {
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
  };
  tripId: string;
  stopName: string;
  index: number;
}

export function ActivityItem({ activity, tripId, stopName, index }: ActivityItemProps) {
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<"delete" | "booked" | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const cat = CATEGORY_CONFIG[activity.category] ?? CATEGORY_CONFIG.OTHER;

  function handleDelete() {
    setPendingAction("delete");
    startTransition(async () => {
      const result = await deleteActivity(activity.id, tripId);
      if (result.error) toast.error(result.error);
      else toast.success("Activity removed");
      setPendingAction(null);
    });
  }

  function handleToggleBooked() {
    setPendingAction("booked");
    startTransition(async () => {
      const result = await toggleActivityBooked(activity.id, tripId, !activity.booked);
      if (result.error) toast.error(result.error);
      setPendingAction(null);
    });
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -12, height: 0 }}
        transition={{ duration: 0.3, delay: index * 0.04 }}
        layout
        className="group flex items-start gap-3 rounded-xl border border-border bg-background p-3 transition-all hover:border-primary/20 hover:shadow-sm"
      >
        {}
        <div className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg text-sm", cat.bg)}>
          {cat.emoji}
        </div>

        {}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold leading-tight text-foreground">
              {activity.name}
            </p>
            {activity.booked && (
              <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                Booked ✓
              </span>
            )}
          </div>

          {activity.description && (
            <p className="text-xs text-muted-foreground line-clamp-1">{activity.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
            {activity.date && (
              <span className="flex items-center gap-1">
                <Calendar className="size-3 text-primary" />
                {format(new Date(activity.date), "MMM d")}
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
              <span className="flex items-center gap-1 font-medium text-foreground">
                <DollarSign className="size-3 text-primary" />
                {activity.cost.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {}
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {}
          <button
            onClick={() => setShowEdit(true)}
            title="Edit activity"
            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <Pencil className="size-3.5" />
          </button>

          {}
          <button
            onClick={handleToggleBooked}
            disabled={isPending}
            title={activity.booked ? "Mark as not booked" : "Mark as booked"}
            className={cn(
              "flex size-7 items-center justify-center rounded-lg transition-colors",
              activity.booked
                ? "text-emerald-500 hover:bg-emerald-500/10"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {pendingAction === "booked" ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : activity.booked ? (
              <CheckCircle2 className="size-3.5" />
            ) : (
              <Circle className="size-3.5" />
            )}
          </button>

          {}
          <button
            onClick={handleDelete}
            disabled={isPending}
            title="Remove activity"
            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            {pendingAction === "delete" ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
          </button>
        </div>
      </motion.div>

      {}
      <EditActivityModal
        activity={activity}
        tripId={tripId}
        stopName={stopName}
        open={showEdit}
        onClose={() => setShowEdit(false)}
      />
    </>
  );
}
