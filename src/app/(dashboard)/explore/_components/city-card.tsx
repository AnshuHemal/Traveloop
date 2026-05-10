"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Star, DollarSign, MapPin, TrendingUp,
  Calendar, Plus, ChevronDown, ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CityData } from "@/lib/cities-data";

const COST_LABELS = ["", "$", "$$", "$$$", "$$$$", "$$$$$"];
const COST_COLORS = [
  "",
  "text-emerald-600 dark:text-emerald-400",
  "text-primary",
  "text-amber-600 dark:text-amber-400",
  "text-orange-600 dark:text-orange-400",
  "text-rose-600 dark:text-rose-400",
];

interface CityCardProps {
  city: CityData;
  index: number;
  onAddToTrip: (city: CityData) => void;
  view: "grid" | "list";
}

export function CityCard({ city, index, onAddToTrip, view }: CityCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (view === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, delay: index * 0.04 }}
        className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
      >
        <div className="flex items-start gap-4 p-4">
          {/* Emoji thumbnail */}
          <div className={cn(
            "flex size-16 shrink-0 items-center justify-center rounded-xl bg-linear-to-br text-3xl transition-transform group-hover:scale-105",
            city.gradient,
          )}>
            {city.emoji}
          </div>

          {/* Main content */}
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                    {city.name}
                  </h3>
                  <span className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {city.region}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{city.country}</p>
              </div>

              {/* Right meta */}
              <div className="hidden flex-col items-end gap-1 sm:flex">
                <span className={cn("text-sm font-bold", COST_COLORS[city.costIndex])}>
                  {COST_LABELS[city.costIndex]}
                </span>
                <span className="text-xs text-muted-foreground">
                  ~${city.avgDailyBudget}/day
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
              {city.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {city.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                {city.popularity}/5
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3 text-primary" />
                Best: {city.bestMonths.slice(0, 3).join(", ")}
              </span>
            </div>
          </div>

          {/* Add button */}
          <button
            onClick={() => onAddToTrip(city)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/8 px-3 py-2 text-xs font-semibold text-primary",
              "hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all",
            )}
          >
            <Plus className="size-3.5" />
            <span className="hidden sm:inline">Add to trip</span>
          </button>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/8">

        {/* Card header */}
        <div className={cn("relative flex h-36 items-center justify-center bg-linear-to-br", city.gradient)}>
          <motion.span
            className="text-5xl"
            whileHover={{ scale: 1.1, rotate: [-3, 3, 0] }}
            transition={{ duration: 0.3 }}
          >
            {city.emoji}
          </motion.span>

          {/* Region badge */}
          <span className="absolute left-3 top-3 rounded-full border border-border/50 bg-background/80 px-2.5 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur-sm">
            {city.region}
          </span>

          {/* Cost badge */}
          <span className={cn(
            "absolute right-3 top-3 rounded-full bg-background/80 px-2.5 py-0.5 text-xs font-bold backdrop-blur-sm",
            COST_COLORS[city.costIndex],
          )}>
            {COST_LABELS[city.costIndex]}
          </span>

          {/* Popularity stars */}
          <div className="absolute bottom-3 left-3 flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-3",
                  i < city.popularity
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted text-muted",
                )}
              />
            ))}
          </div>
        </div>

        {/* Card body */}
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-1 flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                {city.name}
              </h3>
              <p className="text-xs text-muted-foreground">{city.country}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-foreground">~${city.avgDailyBudget}</p>
              <p className="text-[10px] text-muted-foreground">per day</p>
            </div>
          </div>

          <p className="mb-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {city.description}
          </p>

          {/* Tags */}
          <div className="mb-3 flex flex-wrap gap-1">
            {city.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>

          {/* Expandable highlights */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mb-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
            {expanded ? "Hide" : "Show"} highlights
          </button>

          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-3 flex flex-col gap-1"
            >
              {city.highlights.map((h) => (
                <span key={h} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-2.5 text-primary shrink-0" />
                  {h}
                </span>
              ))}
            </motion.div>
          )}

          {/* Best months */}
          <div className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3 text-primary shrink-0" />
            Best: {city.bestMonths.slice(0, 4).join(", ")}
          </div>

          {/* Add to trip button */}
          <button
            onClick={() => onAddToTrip(city)}
            className={cn(
              "mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/8 py-2.5 text-sm font-semibold text-primary",
              "hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200",
            )}
          >
            <Plus className="size-4" />
            Add to trip
          </button>
        </div>
      </div>
    </motion.div>
  );
}
