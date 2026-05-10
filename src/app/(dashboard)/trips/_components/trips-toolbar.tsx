"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { motion } from "motion/react";
import {
  Search, LayoutGrid, List, SlidersHorizontal,
  ChevronDown, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "",          label: "All statuses" },
  { value: "DRAFT",     label: "Draft" },
  { value: "PLANNED",   label: "Planned" },
  { value: "ONGOING",   label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
];

const SORT_OPTIONS = [
  { value: "updatedAt_desc", label: "Recently updated" },
  { value: "createdAt_desc", label: "Newest first" },
  { value: "createdAt_asc",  label: "Oldest first" },
  { value: "title_asc",      label: "Name A–Z" },
  { value: "title_desc",     label: "Name Z–A" },
  { value: "startDate_asc",  label: "Start date ↑" },
  { value: "startDate_desc", label: "Start date ↓" },
];

interface TripsToolbarProps {
  totalCount: number;
  filteredCount: number;
}

export function TripsToolbar({ totalCount, filteredCount }: TripsToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const q      = searchParams.get("q")      ?? "";
  const status = searchParams.get("status") ?? "";
  const sort   = searchParams.get("sort")   ?? "updatedAt_desc";
  const view   = searchParams.get("view")   ?? "grid";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      startTransition(() => router.push(`${pathname}?${params.toString()}`));
    },
    [router, pathname, searchParams],
  );

  const hasFilters = q || status;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-3"
    >
      {}
      <div className="flex items-center gap-3">
        {}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search trips…"
            value={q}
            onChange={(e) => updateParam("q", e.target.value)}
            className={cn(
              "h-10 w-full rounded-xl border border-input bg-background pl-9 pr-9 text-sm shadow-xs outline-none transition-[color,box-shadow]",
              "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              "dark:bg-input/30",
            )}
          />
          {q && (
            <button
              onClick={() => updateParam("q", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {}
        <div className="flex overflow-hidden rounded-xl border border-border bg-muted/30 p-0.5">
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => updateParam("view", v)}
              className={cn(
                "flex size-9 items-center justify-center rounded-lg transition-all",
                view === v
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-label={`${v} view`}
            >
              {v === "grid" ? <LayoutGrid className="size-4" /> : <List className="size-4" />}
            </button>
          ))}
        </div>
      </div>

      {}
      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="size-3.5 text-muted-foreground" />

        {}
        <div className="relative">
          <select
            value={status}
            onChange={(e) => updateParam("status", e.target.value)}
            className={cn(
              "h-8 appearance-none rounded-lg border border-border bg-background pl-3 pr-7 text-xs font-medium shadow-xs outline-none transition-[color,box-shadow]",
              "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",
              "dark:bg-input/30",
              status && "border-primary/40 bg-primary/5 text-primary",
            )}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
        </div>

        {}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className={cn(
              "h-8 appearance-none rounded-lg border border-border bg-background pl-3 pr-7 text-xs font-medium shadow-xs outline-none transition-[color,box-shadow]",
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
              const params = new URLSearchParams(searchParams.toString());
              params.delete("q");
              params.delete("status");
              startTransition(() => router.push(`${pathname}?${params.toString()}`));
            }}
            className="flex items-center gap-1 rounded-lg border border-destructive/20 bg-destructive/8 px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/15 transition-colors"
          >
            <X className="size-3" />
            Clear filters
          </motion.button>
        )}

        {}
        <span className="ml-auto text-xs text-muted-foreground">
          {filteredCount === totalCount
            ? `${totalCount} trip${totalCount !== 1 ? "s" : ""}`
            : `${filteredCount} of ${totalCount} trips`}
        </span>
      </div>
    </motion.div>
  );
}
