"use client";

import { motion } from "motion/react";
import { MapPin, Moon, DollarSign, Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ActivityBlock, type ActivityData } from "./activity-block";

const DESTINATION_EMOJIS: Record<string, string> = {
  France: "🗼", Italy: "🏛️", Spain: "🎨", Portugal: "🌊",
  Japan: "🗾", Thailand: "🏯", Greece: "🏝️", Germany: "🏰",
  USA: "🗽", UK: "🎡", Australia: "🦘", India: "🕌",
  Indonesia: "🌴", UAE: "🏙️", Mexico: "🌮", Brazil: "🌿",
  Netherlands: "🌷", Turkey: "🕌", Singapore: "🦁",
};

const STOP_GRADIENTS = [
  "from-primary/15 via-primary/8 to-transparent",
  "from-violet-500/15 via-violet-500/8 to-transparent",
  "from-emerald-500/15 via-emerald-500/8 to-transparent",
  "from-amber-500/15 via-amber-500/8 to-transparent",
  "from-rose-500/15 via-rose-500/8 to-transparent",
  "from-sky-500/15 via-sky-500/8 to-transparent",
];

interface Stop {
  id: string;
  cityName: string;
  countryName: string;
  arrivalDate: Date | null;
  departureDate: Date | null;
  nights: number;
  notes: string | null;
  order: number;
  activities: ActivityData[];
}

interface ListViewProps {
  stops: Stop[];
  currency: string;
}

export function ListView({ stops, currency }: ListViewProps) {
  if (stops.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/40 py-20 text-center"
      >
        <span className="mb-4 text-5xl">📋</span>
        <h3 className="mb-2 text-lg font-bold text-foreground">No itinerary yet</h3>
        <p className="text-sm text-muted-foreground">Add stops and activities to see your list</p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {stops.map((stop, stopIdx) => {
        const emoji = DESTINATION_EMOJIS[stop.countryName] ?? "📍";
        const gradient = STOP_GRADIENTS[stopIdx % STOP_GRADIENTS.length];
        const stopCost = stop.activities.reduce((acc, a) => acc + a.cost, 0);
        const bookedCount = stop.activities.filter((a) => a.booked).length;

        const dateRange = stop.arrivalDate && stop.departureDate
          ? `${format(new Date(stop.arrivalDate), "MMM d")} – ${format(new Date(stop.departureDate), "MMM d, yyyy")}`
          : stop.arrivalDate
            ? format(new Date(stop.arrivalDate), "MMM d, yyyy")
            : null;

        return (
          <motion.div
            key={stop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: stopIdx * 0.08 }}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
          >
            {/* City header */}
            <div className={cn("bg-linear-to-br px-6 py-5", gradient)}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Number + emoji */}
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-background/80 text-sm font-bold text-foreground shadow-sm">
                      {stopIdx + 1}
                    </div>
                    <span className="text-3xl">{emoji}</span>
                  </div>

                  {/* City info */}
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{stop.cityName}</h3>
                    <p className="text-xs text-muted-foreground">{stop.countryName}</p>
                  </div>
                </div>

                {/* Right meta */}
                <div className="hidden flex-wrap items-center gap-2 sm:flex">
                  {dateRange && (
                    <span className="flex items-center gap-1 rounded-lg bg-background/70 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                      <Calendar className="size-3 text-primary" />
                      {dateRange}
                    </span>
                  )}
                  <span className="flex items-center gap-1 rounded-lg bg-background/70 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                    <Moon className="size-3 text-primary" />
                    {stop.nights}n
                  </span>
                  {stopCost > 0 && (
                    <span className="flex items-center gap-1 rounded-lg bg-background/70 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
                      <DollarSign className="size-3 text-primary" />
                      {currency} {stopCost.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Mobile meta */}
              <div className="mt-2 flex flex-wrap gap-2 sm:hidden">
                {dateRange && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="size-3 text-primary" />
                    {dateRange}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Moon className="size-3 text-primary" />
                  {stop.nights} nights
                </span>
              </div>
            </div>

            {/* Activities */}
            <div className="p-5">
              {/* Notes */}
              {stop.notes && (
                <div className="mb-4 rounded-xl bg-muted/30 px-4 py-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">📝 {stop.notes}</p>
                </div>
              )}

              {stop.activities.length === 0 ? (
                <div className="flex items-center gap-3 rounded-xl border-2 border-dashed border-border py-5 px-4">
                  <span className="text-xl">🎯</span>
                  <p className="text-sm text-muted-foreground">No activities for this stop</p>
                </div>
              ) : (
                <>
                  {/* Activity count header */}
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      {stop.activities.length} {stop.activities.length === 1 ? "activity" : "activities"}
                    </span>
                    {bookedCount > 0 && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400">
                        {bookedCount} booked ✓
                      </span>
                    )}
                  </div>

                  {/* Compact activity list */}
                  <div className="flex flex-col gap-2">
                    {stop.activities
                      .sort((a, b) => {
                        if (a.date && b.date) return new Date(a.date).getTime() - new Date(b.date).getTime();
                        if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
                        return 0;
                      })
                      .map((activity, actIdx) => (
                        <ActivityBlock
                          key={activity.id}
                          activity={activity}
                          index={actIdx}
                          compact
                        />
                      ))}
                  </div>

                  {/* Stop total */}
                  {stopCost > 0 && (
                    <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/30 px-4 py-2.5">
                      <span className="text-xs text-muted-foreground">Stop budget</span>
                      <span className="text-sm font-bold text-foreground">
                        {currency} {stopCost.toLocaleString()}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
