"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const DESTINATIONS = [
  {
    city: "Paris",
    country: "France",
    emoji: "🗼",
    tag: "Trending",
    tagColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    gradient: "from-rose-500/20 via-rose-500/10 to-transparent",
    rating: 4.9,
    trips: "12.4k",
  },
  {
    city: "Tokyo",
    country: "Japan",
    emoji: "🗾",
    tag: "Popular",
    tagColor: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    gradient: "from-violet-500/20 via-violet-500/10 to-transparent",
    rating: 4.8,
    trips: "9.8k",
  },
  {
    city: "Bali",
    country: "Indonesia",
    emoji: "🌴",
    tag: "Hot",
    tagColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    gradient: "from-amber-500/20 via-amber-500/10 to-transparent",
    rating: 4.7,
    trips: "8.2k",
  },
  {
    city: "New York",
    country: "USA",
    emoji: "🗽",
    tag: "Classic",
    tagColor: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    gradient: "from-sky-500/20 via-sky-500/10 to-transparent",
    rating: 4.6,
    trips: "15.1k",
  },
  {
    city: "Santorini",
    country: "Greece",
    emoji: "🏝️",
    tag: "Scenic",
    tagColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    gradient: "from-emerald-500/20 via-emerald-500/10 to-transparent",
    rating: 4.9,
    trips: "6.7k",
  },
];

export function TopDestinations() {
  return (
    <section>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Top Regional Selections</h2>
        </div>
        <Link
          href="/explore"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View all
          <ArrowRight className="size-3.5" />
        </Link>
      </motion.div>

      {/* Horizontal scroll on mobile, grid on desktop */}
      <div className="flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-5 sm:overflow-visible sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {DESTINATIONS.map((dest, i) => (
          <motion.div
            key={dest.city}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="shrink-0 w-36 sm:w-auto"
          >
            <Link
              href={`/trips/new?destination=${encodeURIComponent(dest.city)}`}
              className="group block"
            >
              <div className="overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
                {/* Card visual */}
                <div className={cn(
                  "relative flex h-24 items-center justify-center bg-linear-to-br",
                  dest.gradient,
                )}>
                  <motion.span
                    className="text-4xl"
                    whileHover={{ scale: 1.15, rotate: [-2, 2, -2, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    {dest.emoji}
                  </motion.span>
                  {/* Tag */}
                  <span className={cn(
                    "absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    dest.tagColor,
                  )}>
                    {dest.tag}
                  </span>
                </div>

                {/* Card info */}
                <div className="p-3">
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm leading-tight">
                    {dest.city}
                  </p>
                  <p className="text-xs text-muted-foreground">{dest.country}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="flex items-center gap-0.5 text-[10px] text-amber-500">
                      <Star className="size-2.5 fill-amber-500" />
                      {dest.rating}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{dest.trips} trips</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
