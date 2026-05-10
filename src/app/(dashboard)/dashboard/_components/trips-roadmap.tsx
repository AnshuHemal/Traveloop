"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Calendar, MapPin, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, differenceInDays, startOfDay, isAfter, isBefore, isToday } from "date-fns";

interface RoadmapTrip {
  id: string;
  title: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  currency: string;
  stops: { cityName: string }[];
}

interface TripsRoadmapProps {
  trips: RoadmapTrip[];
}

const STATUS_COLORS: Record<string, { bar: string; dot: string; label: string }> = {
  DRAFT:     { bar: "bg-muted-foreground/40",                dot: "bg-muted-foreground",  label: "Draft" },
  PLANNED:   { bar: "bg-primary/70",                         dot: "bg-primary",            label: "Planned" },
  ONGOING:   { bar: "bg-emerald-500/80",                     dot: "bg-emerald-500",        label: "Ongoing" },
  COMPLETED: { bar: "bg-violet-500/60",                      dot: "bg-violet-500",         label: "Completed" },
};

export function TripsRoadmap({ trips }: TripsRoadmapProps) {

  const datedTrips = trips.filter((t) => t.startDate && t.endDate);

  if (datedTrips.length === 0) return null;

  const allDates = datedTrips.flatMap((t) => [
    new Date(t.startDate!),
    new Date(t.endDate!),
  ]);
  const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));

  const rangeStart = new Date(minDate);
  rangeStart.setDate(rangeStart.getDate() - 7);
  const rangeEnd = new Date(maxDate);
  rangeEnd.setDate(rangeEnd.getDate() + 7);

  const totalDays = differenceInDays(rangeEnd, rangeStart) || 1;
  const today = startOfDay(new Date());

  function pct(date: Date) {
    return Math.max(0, Math.min(100, (differenceInDays(date, rangeStart) / totalDays) * 100));
  }

  const todayPct = pct(today);
  const showToday = isAfter(today, rangeStart) && isBefore(today, rangeEnd);

  const months: { label: string; pct: number }[] = [];
  const cursor = new Date(rangeStart);
  cursor.setDate(1);
  while (cursor <= rangeEnd) {
    months.push({ label: format(cursor, "MMM yyyy"), pct: pct(cursor) });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4 flex items-center gap-2"
      >
        <TrendingUp className="size-4 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Trip Roadmap</h2>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {datedTrips.length} trip{datedTrips.length !== 1 ? "s" : ""}
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="overflow-hidden rounded-2xl border border-border bg-card p-5"
      >
        {}
        <div className="relative mb-2 h-5">
          {months.map((m) => (
            <span
              key={m.label}
              className="absolute -translate-x-1/2 text-[10px] font-medium text-muted-foreground"
              style={{ left: `${m.pct}%` }}
            >
              {m.label}
            </span>
          ))}
        </div>

        {}
        <div className="relative">
          {}
          <div className="absolute inset-0 flex">
            {months.map((m) => (
              <div
                key={m.label}
                className="absolute top-0 bottom-0 w-px bg-border/50"
                style={{ left: `${m.pct}%` }}
              />
            ))}
          </div>

          {}
          {showToday && (
            <div
              className="absolute top-0 bottom-0 z-10 w-0.5 bg-primary/60"
              style={{ left: `${todayPct}%` }}
            >
              <span className="absolute -top-5 -translate-x-1/2 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">
                Today
              </span>
            </div>
          )}

          {}
          <div className="flex flex-col gap-3 py-2">
            {datedTrips.map((trip, i) => {
              const start = pct(new Date(trip.startDate!));
              const end   = pct(new Date(trip.endDate!));
              const width = Math.max(end - start, 1.5);
              const colors = STATUS_COLORS[trip.status] ?? STATUS_COLORS.DRAFT;
              const isActive = trip.status === "ONGOING";

              return (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  className="relative flex h-10 items-center"
                >
                  {}
                  <div className="absolute right-full mr-2 hidden w-24 text-right sm:block">
                    <p className="truncate text-xs font-medium text-foreground">{trip.title}</p>
                    {trip.stops.length > 0 && (
                      <p className="truncate text-[10px] text-muted-foreground">
                        {trip.stops.slice(0, 2).map((s) => s.cityName).join(", ")}
                      </p>
                    )}
                  </div>

                  {}
                  <Link
                    href={`/trips/${trip.id}`}
                    className="absolute group flex h-8 items-center overflow-hidden rounded-lg transition-all hover:brightness-110 hover:shadow-md"
                    style={{ left: `${start}%`, width: `${width}%` }}
                    title={trip.title}
                  >
                    <div className={cn("h-full w-full rounded-lg", colors.bar, isActive && "animate-pulse")} />
                    {}
                    {width > 8 && (
                      <span className="absolute inset-0 flex items-center px-2 text-[10px] font-semibold text-white/90 truncate">
                        {trip.title}
                      </span>
                    )}
                  </Link>

                  {}
                  <div
                    className={cn("absolute size-2.5 rounded-full border-2 border-background z-10", colors.dot)}
                    style={{ left: `${start}%`, transform: "translateX(-50%)" }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        {}
        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border pt-3">
          {Object.entries(STATUS_COLORS).map(([key, cfg]) => (
            <span key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={cn("size-2 rounded-full", cfg.dot)} />
              {cfg.label}
            </span>
          ))}
          {showToday && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-3 w-0.5 rounded-full bg-primary/60" />
              Today
            </span>
          )}
        </div>
      </motion.div>
    </section>
  );
}
