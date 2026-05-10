"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Search, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { REGIONS } from "@/lib/cities-data";

const SORT_OPTIONS = [
  { value: "popularity",   label: "Most popular" },
  { value: "budget_asc",   label: "Budget: Low → High" },
  { value: "budget_desc",  label: "Budget: High → Low" },
  { value: "name",         label: "Name A–Z" },
];

const COST_OPTIONS = [
  { value: "0", label: "Any budget" },
  { value: "1", label: "Budget ($)" },
  { value: "2", label: "Moderate ($$)" },
  { value: "3", label: "Comfortable ($$$)" },
  { value: "4", label: "Premium ($$$$)" },
];

interface ExploreToolbarProps {
  totalCount: number;
  filteredCount: number;
}

export function ExploreToolbar({ totalCount, filteredCount }: ExploreToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const q       = searchParams.get("q")       ?? "";
  const region  = searchParams.get("region")  ?? "All";
  const maxCost = searchParams.get("maxCost") ?? "0";
  const sort    = searchParams.get("sort")    ?? "popularity";

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "0" && value !== "All") params.set(key, value);
      else params.delete(key);
      startTransition(() => router.push(`${pathname}?${params.toString()}`));
    },
    [router, pathname, searchParams],
  );

  const hasFilters = !!(q || (region && region !== "All") || (maxCost && maxCost !== "0"));

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-3"
    >
      {}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search cities, countries, or activities…"
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
      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="size-3.5 text-muted-foreground" />

        {}
        <div className="flex flex-wrap gap-1.5">
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => update("region", r)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-all",
                region === r || (r === "All" && !region)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {r}
            </button>
          ))}
        </div>

        {}
        <div className="relative ml-auto">
          <select
            value={maxCost}
            onChange={(e) => update("maxCost", e.target.value)}
            className={cn(
              "h-8 appearance-none rounded-lg border border-border bg-background pl-3 pr-7 text-xs font-medium shadow-xs outline-none",
              "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",
              "dark:bg-input/30",
              maxCost !== "0" && "border-primary/40 bg-primary/5 text-primary",
            )}
          >
            {COST_OPTIONS.map((o) => (
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
              "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",
              "dark:bg-input/30",
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
            onClick={() => {
              startTransition(() => router.push(pathname));
            }}
            className="flex items-center gap-1 rounded-lg border border-destructive/20 bg-destructive/8 px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/15 transition-colors"
          >
            <X className="size-3" />
            Clear
          </motion.button>
        )}

        {}
        <span className="text-xs text-muted-foreground">
          {filteredCount === totalCount
            ? `${totalCount} cities`
            : `${filteredCount} of ${totalCount}`}
        </span>
      </div>
    </motion.div>
  );
}
