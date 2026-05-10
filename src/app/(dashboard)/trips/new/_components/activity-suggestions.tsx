"use client";

import { motion } from "motion/react";
import { Sparkles, Star, Clock, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivitySuggestionsProps {
  destination?: string;
}

const DEFAULT_SUGGESTIONS = [
  {
    name: "City Walking Tour",
    category: "Sightseeing",
    duration: "3h",
    cost: "$25",
    rating: 4.8,
    emoji: "🚶",
    color: "from-primary/15 to-primary/5",
    tag: "Popular",
    tagColor: "bg-primary/10 text-primary",
  },
  {
    name: "Local Food Market",
    category: "Food & Dining",
    duration: "2h",
    cost: "$15",
    rating: 4.7,
    emoji: "🍜",
    color: "from-amber-500/15 to-amber-500/5",
    tag: "Must try",
    tagColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    name: "Museum Visit",
    category: "Culture",
    duration: "2.5h",
    cost: "$20",
    rating: 4.6,
    emoji: "🏛️",
    color: "from-violet-500/15 to-violet-500/5",
    tag: "Cultural",
    tagColor: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    name: "Sunset Viewpoint",
    category: "Sightseeing",
    duration: "1h",
    cost: "Free",
    rating: 4.9,
    emoji: "🌅",
    color: "from-rose-500/15 to-rose-500/5",
    tag: "Free",
    tagColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "Boat / River Cruise",
    category: "Adventure",
    duration: "2h",
    cost: "$35",
    rating: 4.7,
    emoji: "⛵",
    color: "from-sky-500/15 to-sky-500/5",
    tag: "Adventure",
    tagColor: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  {
    name: "Night Market",
    category: "Shopping",
    duration: "2h",
    cost: "$10",
    rating: 4.5,
    emoji: "🏮",
    color: "from-orange-500/15 to-orange-500/5",
    tag: "Evening",
    tagColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
];

export function ActivitySuggestions({ destination }: ActivitySuggestionsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
          <Sparkles className="size-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Suggested Activities
            {destination && (
              <span className="ml-1.5 text-muted-foreground font-normal">
                for {destination}
              </span>
            )}
          </h3>
          <p className="text-xs text-muted-foreground">
            Add these to your itinerary after creating the trip
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {DEFAULT_SUGGESTIONS.map((activity, i) => (
          <motion.div
            key={activity.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5 cursor-default"
          >
            {/* Gradient header */}
            <div className={cn("flex h-20 items-center justify-center bg-linear-to-br", activity.color)}>
              <motion.span
                className="text-3xl"
                whileHover={{ scale: 1.15, rotate: [-3, 3, 0] }}
                transition={{ duration: 0.3 }}
              >
                {activity.emoji}
              </motion.span>
              {/* Tag */}
              <span className={cn(
                "absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                activity.tagColor,
              )}>
                {activity.tag}
              </span>
            </div>

            {/* Body */}
            <div className="p-3">
              <p className="mb-0.5 text-xs font-semibold text-foreground line-clamp-1">
                {activity.name}
              </p>
              <p className="mb-2 text-[10px] text-muted-foreground">{activity.category}</p>

              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  <Clock className="size-2.5" />
                  {activity.duration}
                </span>
                <span className="flex items-center gap-0.5">
                  <DollarSign className="size-2.5" />
                  {activity.cost}
                </span>
                <span className="flex items-center gap-0.5 text-amber-500">
                  <Star className="size-2.5 fill-amber-500" />
                  {activity.rating}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        ✨ You can add activities to specific stops after creating your trip
      </p>
    </div>
  );
}
