"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft, Globe, Lock, Calendar,
  MapPin, DollarSign, ChevronDown, CheckCircle2,
  Clock, Loader2, Share2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { updateTripStatus } from "../actions";

const STATUS_CONFIG = {
  DRAFT:     { label: "Draft",     color: "bg-muted text-muted-foreground",                           dot: "bg-muted-foreground/60", next: "PLANNED"   as const },
  PLANNED:   { label: "Planned",   color: "bg-primary/10 text-primary",                               dot: "bg-primary",             next: "ONGOING"   as const },
  ONGOING:   { label: "Ongoing",   color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500",         next: "COMPLETED" as const },
  COMPLETED: { label: "Completed", color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",    dot: "bg-violet-500",          next: "DRAFT"     as const },
} as const;

const GRADIENT_MAP: Record<string, string> = {
  DRAFT:     "from-muted/60 via-muted/30 to-transparent",
  PLANNED:   "from-primary/20 via-primary/10 to-transparent",
  ONGOING:   "from-emerald-500/20 via-emerald-500/10 to-transparent",
  COMPLETED: "from-violet-500/20 via-violet-500/10 to-transparent",
};

interface TripHeaderProps {
  trip: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    visibility: string;
    currency: string;
    startDate: Date | null;
    endDate: Date | null;
    _count: { stops: number };
  };
}

export function TripHeader({ trip }: TripHeaderProps) {
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const status = STATUS_CONFIG[trip.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.DRAFT;
  const gradient = GRADIENT_MAP[trip.status] ?? GRADIENT_MAP.DRAFT;

  function handleStatusChange(newStatus: "DRAFT" | "PLANNED" | "ONGOING" | "COMPLETED") {
    setStatusMenuOpen(false);
    startTransition(async () => {
      const result = await updateTripStatus(trip.id, newStatus);
      if (result.error) toast.error(result.error);
      else toast.success(`Status updated to ${newStatus.toLowerCase()}`);
    });
  }

  const dateRange = trip.startDate && trip.endDate
    ? `${format(new Date(trip.startDate), "MMM d")} – ${format(new Date(trip.endDate), "MMM d, yyyy")}`
    : trip.startDate
      ? `From ${format(new Date(trip.startDate), "MMM d, yyyy")}`
      : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Back link */}
      <Link
        href="/trips"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="size-4" />
        Back to trips
      </Link>

      {/* Hero banner */}
      <div className={cn(
        "relative overflow-hidden rounded-2xl bg-linear-to-br px-6 py-8 sm:px-8 sm:py-10",
        gradient,
      )}>
        {/* Decorative blobs */}
        <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-primary/8 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/3 size-32 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: title + meta */}
          <div className="flex flex-col gap-3">
            {/* Status + visibility */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Status dropdown */}
              <div className="relative">
                <button
                  onClick={() => setStatusMenuOpen((v) => !v)}
                  disabled={isPending}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all hover:opacity-80",
                    status.color,
                  )}
                >
                  {isPending ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <span className={cn("size-1.5 rounded-full", status.dot)} />
                  )}
                  {status.label}
                  <ChevronDown className="size-3" />
                </button>

                <AnimatePresence>
                  {statusMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setStatusMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full z-20 mt-1.5 w-44 overflow-hidden rounded-xl border border-border bg-popover shadow-xl"
                      >
                        <div className="p-1">
                          {(Object.entries(STATUS_CONFIG) as [string, typeof STATUS_CONFIG[keyof typeof STATUS_CONFIG]][]).map(([key, cfg]) => (
                            <button
                              key={key}
                              onClick={() => handleStatusChange(key as "DRAFT" | "PLANNED" | "ONGOING" | "COMPLETED")}
                              className={cn(
                                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                                trip.status === key && "bg-accent",
                              )}
                            >
                              <span className={cn("size-2 rounded-full", cfg.dot)} />
                              {cfg.label}
                              {trip.status === key && <CheckCircle2 className="ml-auto size-3.5 text-primary" />}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Visibility */}
              <span className="flex items-center gap-1 rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                {trip.visibility === "PUBLIC" ? (
                  <><Globe className="size-3" /> Public</>
                ) : (
                  <><Lock className="size-3" /> Private</>
                )}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {trip.title}
            </h1>

            {/* Description */}
            {trip.description && (
              <p className="max-w-xl text-sm text-muted-foreground leading-relaxed">
                {trip.description}
              </p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {trip._count.stops > 0 && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-primary" />
                  {trip._count.stops} {trip._count.stops === 1 ? "stop" : "stops"}
                </span>
              )}
              {dateRange && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-4 text-primary" />
                  {dateRange}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <DollarSign className="size-4 text-primary" />
                {trip.currency}
              </span>
            </div>
          </div>

          {/* Right: action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/trips/${trip.id}/edit`}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-background/80 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm hover:bg-background transition-colors"
            >
              Edit trip
            </Link>
            <button className="flex items-center gap-1.5 rounded-xl border border-border bg-background/80 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm hover:bg-background transition-colors">
              <Share2 className="size-4" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
