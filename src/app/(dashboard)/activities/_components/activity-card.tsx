"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Star, Clock, DollarSign, Plus, Check,
  ChevronDown, ChevronUp, Loader2, Info,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ActivityTemplate } from "@/lib/activities-data";
import { COST_TIER_LABELS, COST_TIER_COLORS } from "@/lib/activities-data";
import { addActivityToStop } from "../actions";

const CATEGORY_EMOJI: Record<string, string> = {
  SIGHTSEEING:   "🏛️",
  FOOD:          "🍜",
  TRANSPORT:     "✈️",
  ACCOMMODATION: "🏨",
  ADVENTURE:     "🧗",
  CULTURE:       "🎭",
  SHOPPING:      "🛍️",
  NIGHTLIFE:     "🌃",
  WELLNESS:      "🧘",
  OTHER:         "📌",
};

interface Stop {
  id: string;
  cityName: string;
  tripId: string;
}

interface ActivityCardProps {
  activity: ActivityTemplate;
  index: number;
  stops: Stop[];
  addedStopIds: Set<string>;
  onAdded: (stopId: string, activityId: string) => void;
}

export function ActivityCard({
  activity, index, stops, addedStopIds, onAdded,
}: ActivityCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showStopPicker, setShowStopPicker] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [pendingStopId, setPendingStopId] = useState<string | null>(null);

  const costColor = COST_TIER_COLORS[activity.costTier];
  const costLabel = COST_TIER_LABELS[activity.costTier];

  function handleAdd(stop: Stop) {
    if (addedStopIds.has(stop.id)) return;
    setPendingStopId(stop.id);
    startTransition(async () => {
      const result = await addActivityToStop(stop.id, stop.tripId, activity);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`"${activity.name}" added to ${stop.cityName}`);
        onAdded(stop.id, activity.id);
      }
      setPendingStopId(null);
      setShowStopPicker(false);
    });
  }

  const hasStops = stops.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      layout
      className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/8"
    >
      {/* Card header */}
      <div className={cn("relative flex h-28 items-center justify-center bg-linear-to-br", activity.gradient)}>
        <motion.span
          className="text-5xl"
          whileHover={{ scale: 1.1, rotate: [-3, 3, 0] }}
          transition={{ duration: 0.3 }}
        >
          {activity.emoji}
        </motion.span>

        {/* Popular badge */}
        {activity.popular && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground backdrop-blur-sm">
            🔥 Popular
          </span>
        )}

        {/* Cost badge */}
        <span className={cn(
          "absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-bold backdrop-blur-sm",
          costColor,
        )}>
          {activity.costTier === "free" ? "Free" : costLabel}
        </span>

        {/* Rating */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 backdrop-blur-sm">
          <Star className="size-3 fill-amber-400 text-amber-400" />
          <span className="text-[10px] font-semibold text-foreground">{activity.rating}</span>
        </div>

        {/* Duration */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 backdrop-blur-sm">
          <Clock className="size-3 text-primary" />
          <span className="text-[10px] font-medium text-foreground">{activity.durationLabel}</span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        {/* Title + category */}
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
              {activity.name}
            </h3>
            <span className="text-xs text-muted-foreground">
              {CATEGORY_EMOJI[activity.category]} {activity.category.charAt(0) + activity.category.slice(1).toLowerCase()}
            </span>
          </div>
          {activity.avgCost > 0 && (
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-foreground">~${activity.avgCost}</p>
              <p className="text-[10px] text-muted-foreground">per person</p>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="mb-3 text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {activity.description}
        </p>

        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-1">
          {activity.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        {/* Expandable details */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mb-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <Info className="size-3" />
          {expanded ? "Hide" : "Show"} details
          {expanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mb-3 overflow-hidden"
            >
              <div className="flex flex-col gap-2.5 rounded-xl bg-muted/30 p-3">
                {/* Highlights */}
                <div>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Highlights
                  </p>
                  <div className="flex flex-col gap-1">
                    {activity.highlights.map((h) => (
                      <span key={h} className="flex items-center gap-1.5 text-xs text-foreground">
                        <span className="size-1.5 rounded-full bg-primary shrink-0" />
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    💡 Tip
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{activity.tips}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add to trip button */}
        <div className="relative">
          {!hasStops ? (
            <button
              disabled
              className="w-full rounded-xl border-2 border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground cursor-not-allowed"
            >
              Add a stop to your trip first
            </button>
          ) : stops.length === 1 ? (
            // Single stop — direct add
            <button
              onClick={() => handleAdd(stops[0])}
              disabled={isPending || addedStopIds.has(stops[0].id)}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200",
                addedStopIds.has(stops[0].id)
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 cursor-default"
                  : "border border-primary/30 bg-primary/8 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary",
              )}
            >
              {pendingStopId === stops[0].id ? (
                <><Loader2 className="size-4 animate-spin" /> Adding…</>
              ) : addedStopIds.has(stops[0].id) ? (
                <><Check className="size-4" /> Added to {stops[0].cityName}</>
              ) : (
                <><Plus className="size-4" /> Add to {stops[0].cityName}</>
              )}
            </button>
          ) : (
            // Multiple stops — show picker
            <>
              <button
                onClick={() => setShowStopPicker((v) => !v)}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/8 py-2.5 text-sm font-semibold text-primary transition-all",
                  "hover:bg-primary hover:text-primary-foreground hover:border-primary",
                )}
              >
                <Plus className="size-4" />
                Add to trip
                <ChevronDown className={cn("size-3.5 transition-transform", showStopPicker && "rotate-180")} />
              </button>

              <AnimatePresence>
                {showStopPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-0 right-0 z-20 mb-2 overflow-hidden rounded-xl border border-border bg-popover shadow-xl"
                  >
                    <div className="p-1.5">
                      <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Choose a stop
                      </p>
                      {stops.map((stop) => {
                        const isAdded = addedStopIds.has(stop.id);
                        const isLoading = pendingStopId === stop.id;
                        return (
                          <button
                            key={stop.id}
                            onClick={() => !isAdded && handleAdd(stop)}
                            disabled={isAdded || isLoading}
                            className={cn(
                              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                              isAdded
                                ? "text-emerald-600 dark:text-emerald-400 cursor-default"
                                : "text-foreground hover:bg-accent",
                            )}
                          >
                            {isLoading ? (
                              <Loader2 className="size-3.5 animate-spin text-primary" />
                            ) : isAdded ? (
                              <Check className="size-3.5 text-emerald-500" />
                            ) : (
                              <Plus className="size-3.5 text-primary" />
                            )}
                            <span className="font-medium">{stop.cityName}</span>
                            {isAdded && (
                              <span className="ml-auto text-[10px] text-emerald-500">Added</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
