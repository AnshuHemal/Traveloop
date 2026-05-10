"use client";

import { motion } from "motion/react";
import { MapPin, Moon, DollarSign, Calendar } from "lucide-react";
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

const STOP_COLORS = [
  { dot: "bg-primary",       line: "bg-primary/30",       badge: "bg-primary/10 text-primary border-primary/20" },
  { dot: "bg-violet-500",    line: "bg-violet-500/30",    badge: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
  { dot: "bg-emerald-500",   line: "bg-emerald-500/30",   badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { dot: "bg-amber-500",     line: "bg-amber-500/30",     badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { dot: "bg-rose-500",      line: "bg-rose-500/30",      badge: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
  { dot: "bg-sky-500",       line: "bg-sky-500/30",       badge: "bg-sky-500/10 text-sky-600 border-sky-500/20" },
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

interface TimelineViewProps {
  stops: Stop[];
  currency: string;
}

export function TimelineView({ stops, currency }: TimelineViewProps) {
  if (stops.length === 0) {
    return <EmptyView />;
  }

  return (
    <div className="relative flex flex-col gap-0">
      {stops.map((stop, stopIdx) => {
        const colors = STOP_COLORS[stopIdx % STOP_COLORS.length];
        const emoji = DESTINATION_EMOJIS[stop.countryName] ?? "📍";
        const isLast = stopIdx === stops.length - 1;
        const stopCost = stop.activities.reduce((acc, a) => acc + a.cost, 0);

        const dateRange = stop.arrivalDate && stop.departureDate
          ? `${format(new Date(stop.arrivalDate), "MMM d")} – ${format(new Date(stop.departureDate), "MMM d, yyyy")}`
          : stop.arrivalDate
            ? format(new Date(stop.arrivalDate), "MMM d, yyyy")
            : null;

        return (
          <div key={stop.id} className="flex gap-5">
            {/* Timeline spine */}
            <div className="flex flex-col items-center">
              {/* Dot */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: stopIdx * 0.1 }}
                className={cn(
                  "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-4 border-background text-lg shadow-md",
                  colors.dot,
                )}
              >
                {emoji}
              </motion.div>
              {/* Connector line */}
              {!isLast && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.4, delay: stopIdx * 0.1 + 0.2 }}
                  style={{ originY: 0 }}
                  className={cn("w-0.5 flex-1 my-2 rounded-full min-h-8", colors.line)}
                />
              )}
            </div>

            {/* Stop content */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: stopIdx * 0.1 }}
              className={cn("flex-1 pb-8", isLast && "pb-0")}
            >
              {/* Stop header */}
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-foreground">{stop.cityName}</h3>
                    <span className={cn(
                      "rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                      colors.badge,
                    )}>
                      Stop {stopIdx + 1}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stop.countryName}</p>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {dateRange && (
                    <span className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 px-2.5 py-1">
                      <Calendar className="size-3 text-primary" />
                      {dateRange}
                    </span>
                  )}
                  <span className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 px-2.5 py-1">
                    <Moon className="size-3 text-primary" />
                    {stop.nights} night{stop.nights !== 1 ? "s" : ""}
                  </span>
                  {stopCost > 0 && (
                    <span className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 px-2.5 py-1 font-medium text-foreground">
                      <DollarSign className="size-3 text-primary" />
                      {currency} {stopCost.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Notes */}
              {stop.notes && (
                <div className="mb-4 rounded-xl border border-border bg-muted/30 px-4 py-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">📝 {stop.notes}</p>
                </div>
              )}

              {/* Activities */}
              {stop.activities.length > 0 ? (
                <div className="flex flex-col gap-3">
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
                      />
                    ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-xl border-2 border-dashed border-border py-6 px-4 text-center">
                  <span className="text-2xl">🎯</span>
                  <p className="text-sm text-muted-foreground">No activities planned for this stop yet</p>
                </div>
              )}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

function EmptyView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/40 py-20 text-center"
    >
      <span className="mb-4 text-5xl">🗺️</span>
      <h3 className="mb-2 text-lg font-bold text-foreground">No itinerary yet</h3>
      <p className="text-sm text-muted-foreground">Add stops and activities to see your timeline</p>
    </motion.div>
  );
}
