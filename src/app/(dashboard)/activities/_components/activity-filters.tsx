"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition, useRef } from "react";
import { motion } from "motion/react";
import { Search, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ACTIVITY_CATEGORIES, DURATION_OPTIONS, COST_TIER_OPTIONS,
} from "@/lib/activities-data";

const SORT_OPTIONS = [
  { value: "popular",      label: "Most popular" },
  { value: "rating",       label: "Highest rated" },
  { value: "cost_asc",     label: "Cost: Low → High" },
  { value: "cost_desc",    label: "Cost: High → Low" },
  { value: "duration_asc", label: "Shortest first" },
  { value: "name",         label: "Name A–Z" },
];

interface ActivityFiltersProps {
  totalCount: number;
  filteredCount: number;
}

export function ActivityFilters({ totalCount, filteredCount }: ActivityFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const q        = searchParams.get("q")        ?? "";
  const category = searchParams.get("category") ?? "ALL";
  const duration = searchParams.get("duration") ?? "ALL";
  const costTier = searchParams.get("costTier") ?? "ALL";
  const sort     = searchParams.get("sort")     ?? "popular";

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "ALL") params.set(key, value);
      else params.delete(key);
      startTransition(() => router.push(`${pathname}?${params.toString()}`));
    },
    [router, pathname, searchParams],
  );

  const hasFilters = !!(q || (category !== "ALL") || (duration !== "ALL") || (costTier !== "ALL"));

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-4"
    >
      {}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search activities, experiences, or keywords…"
          value={q}
          onChange={(e) => update("q", e.target.value)}
          className={cn(
            "h-12 w-full rounded-2xl border border-input bg-background pl-11 pr-10 text-sm shadow-sm outline-none transition-[color,box-shadow]",
            "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            "dark:bg-input/30",
          )}
        />
        {q && (
          <button
            onClick={() => { update("q", ""); inputRef.current?.focus(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {}
      <div className="flex flex-wrap gap-2">
        {ACTIVITY_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => update("category", cat.value)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
              (category === cat.value) || (cat.value === "ALL" && category === "ALL")
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {}
      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="size-3.5 text-muted-foreground" />

        {}
        <div className="relative">
          <select
            value={duration}
            onChange={(e) => update("duration", e.target.value)}
            className={cn(
              "h-8 appearance-none rounded-lg border border-border bg-background pl-3 pr-7 text-xs font-medium shadow-xs outline-none",
              "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 dark:bg-input/30",
              duration !== "ALL" && "border-primary/40 bg-primary/5 text-primary",
            )}
          >
            {DURATION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
        </div>

        {}
        <div className="relative">
          <select
            value={costTier}
            onChange={(e) => update("costTier", e.target.value)}
            className={cn(
              "h-8 appearance-none rounded-lg border border-border bg-background pl-3 pr-7 text-xs font-medium shadow-xs outline-none",
              "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 dark:bg-input/30",
              costTier !== "ALL" && "border-primary/40 bg-primary/5 text-primary",
            )}
          >
            {COST_TIER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
        </div>

        {}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => update("sort", e.target.value)}
            className={cn(
              "h-8 appearance-none rounded-lg border border-border bg-background pl-3 pr-7 text-xs font-medium shadow-xs outline-none",
              "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 dark:bg-input/30",
            )}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
        </div>

        {}
        {hasFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => startTransition(() => router.push(pathname))}
            className="flex items-center gap-1 rounded-lg border border-destructive/20 bg-destructive/8 px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/15 transition-colors"
          >
            <X className="size-3" />
            Clear
          </motion.button>
        )}

        {}
        <span className="ml-auto text-xs text-muted-foreground">
          {filteredCount === totalCount
            ? `${totalCount} activities`
            : `${filteredCount} of ${totalCount}`}
        </span>
      </div>
    </motion.div>
  );
}
