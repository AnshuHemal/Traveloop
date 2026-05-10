"use client";

import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameDay, isSameMonth, addMonths, subMonths,
  isWithinInterval, parseISO,
} from "date-fns";
import { cn } from "@/lib/utils";
import { ActivityBlock, type ActivityData } from "./activity-block";

const DESTINATION_EMOJIS: Record<string, string> = {
  France: "🗼", Italy: "🏛️", Spain: "🎨", Portugal: "🌊",
  Japan: "🗾", Thailand: "🏯", Greece: "🏝️", Germany: "🏰",
  USA: "🗽", UK: "🎡", Australia: "🦘", India: "🕌",
  Indonesia: "🌴", UAE: "🏙️", Mexico: "🌮", Brazil: "🌿",
};

const STOP_DOT_COLORS = [
  "bg-primary", "bg-violet-500", "bg-emerald-500",
  "bg-amber-500", "bg-rose-500", "bg-sky-500",
];

interface Stop {
  id: string;
  cityName: string;
  countryName: string;
  arrivalDate: Date | null;
  departureDate: Date | null;
  nights: number;
  activities: ActivityData[];
}

interface CalendarViewProps {
  stops: Stop[];
  currency: string;
  tripStartDate: Date | null;
}

export function CalendarView({ stops, currency, tripStartDate }: CalendarViewProps) {

  const firstDate = stops.find((s) => s.arrivalDate)?.arrivalDate
    ?? tripStartDate
    ?? new Date();

  const [currentMonth, setCurrentMonth] = useState(startOfMonth(firstDate));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd   = endOfMonth(currentMonth);
  const days       = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startPad = (monthStart.getDay() + 6) % 7;
  const paddedDays: (Date | null)[] = [
    ...Array(startPad).fill(null),
    ...days,
  ];

  const dayMap: Record<string, {
    activities: (ActivityData & { stopName: string; stopColor: string })[];
    stopNames: string[];
    isArrival: boolean;
    isDeparture: boolean;
    isInTrip: boolean;
  }> = {};

  stops.forEach((stop, si) => {
    const color = STOP_DOT_COLORS[si % STOP_DOT_COLORS.length];

    if (stop.arrivalDate) {
      const k = format(new Date(stop.arrivalDate), "yyyy-MM-dd");
      if (!dayMap[k]) dayMap[k] = { activities: [], stopNames: [], isArrival: false, isDeparture: false, isInTrip: false };
      dayMap[k].isArrival = true;
      dayMap[k].stopNames.push(stop.cityName);
    }
    if (stop.departureDate) {
      const k = format(new Date(stop.departureDate), "yyyy-MM-dd");
      if (!dayMap[k]) dayMap[k] = { activities: [], stopNames: [], isArrival: false, isDeparture: false, isInTrip: false };
      dayMap[k].isDeparture = true;
    }

    if (stop.arrivalDate && stop.departureDate) {
      const interval = { start: new Date(stop.arrivalDate), end: new Date(stop.departureDate) };
      days.forEach((d) => {
        if (isWithinInterval(d, interval)) {
          const k = format(d, "yyyy-MM-dd");
          if (!dayMap[k]) dayMap[k] = { activities: [], stopNames: [], isArrival: false, isDeparture: false, isInTrip: false };
          dayMap[k].isInTrip = true;
          if (!dayMap[k].stopNames.includes(stop.cityName)) {
            dayMap[k].stopNames.push(stop.cityName);
          }
        }
      });
    }

    stop.activities.forEach((act) => {
      if (!act.date) return;
      const k = format(new Date(act.date), "yyyy-MM-dd");
      if (!dayMap[k]) dayMap[k] = { activities: [], stopNames: [], isArrival: false, isDeparture: false, isInTrip: false };
      dayMap[k].activities.push({ ...act, stopName: stop.cityName, stopColor: color });
    });
  });

  const selectedKey = selectedDay ? format(selectedDay, "yyyy-MM-dd") : null;
  const selectedData = selectedKey ? dayMap[selectedKey] : null;

  if (stops.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/40 py-20 text-center"
      >
        <span className="mb-4 text-5xl">📅</span>
        <h3 className="mb-2 text-lg font-bold text-foreground">No itinerary yet</h3>
        <p className="text-sm text-muted-foreground">Add stops with dates to see your calendar</p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        {}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <button
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>
          <h3 className="text-base font-bold text-foreground">
            {format(currentMonth, "MMMM yyyy")}
          </h3>
          <button
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        {}
        <div className="grid grid-cols-7 border-b border-border">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="py-2 text-center text-xs font-semibold text-muted-foreground">
              {d}
            </div>
          ))}
        </div>

        {}
        <div className="grid grid-cols-7">
          {paddedDays.map((day, i) => {
            if (!day) {
              return <div key={`pad-${i}`} className="aspect-square border-b border-r border-border/50 last:border-r-0" />;
            }

            const key = format(day, "yyyy-MM-dd");
            const data = dayMap[key];
            const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;
            const isToday = isSameDay(day, new Date());
            const inMonth = isSameMonth(day, currentMonth);
            const hasActivities = (data?.activities.length ?? 0) > 0;
            const isInTrip = data?.isInTrip ?? false;

            return (
              <button
                key={key}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className={cn(
                  "relative flex aspect-square flex-col items-center justify-start gap-0.5 border-b border-r border-border/50 p-1 text-xs transition-all last:border-r-0 hover:bg-muted/50",
                  !inMonth && "opacity-30",
                  isSelected && "bg-primary/10 border-primary/30",
                  isInTrip && !isSelected && "bg-primary/5",
                )}
              >
                {}
                <span className={cn(
                  "flex size-6 items-center justify-center rounded-full font-medium",
                  isToday && "bg-primary text-primary-foreground",
                  isSelected && !isToday && "bg-primary/20 text-primary font-bold",
                  !isToday && !isSelected && "text-foreground",
                )}>
                  {format(day, "d")}
                </span>

                {}
                {data?.isArrival && (
                  <span className="text-[8px] font-bold text-primary leading-none">✈ IN</span>
                )}
                {data?.isDeparture && !data?.isArrival && (
                  <span className="text-[8px] font-bold text-muted-foreground leading-none">✈ OUT</span>
                )}

                {}
                {hasActivities && (
                  <div className="flex flex-wrap justify-center gap-0.5">
                    {data!.activities.slice(0, 3).map((act, ai) => (
                      <span
                        key={ai}
                        className={cn("size-1.5 rounded-full", act.stopColor)}
                      />
                    ))}
                    {data!.activities.length > 3 && (
                      <span className="text-[8px] text-muted-foreground">+{data!.activities.length - 3}</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {}
        <div className="flex flex-wrap items-center gap-3 border-t border-border px-5 py-3">
          {stops.slice(0, 4).map((stop, si) => (
            <span key={stop.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={cn("size-2 rounded-full", STOP_DOT_COLORS[si % STOP_DOT_COLORS.length])} />
              {stop.cityName}
            </span>
          ))}
        </div>
      </motion.div>

      {}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-full lg:w-80 shrink-0"
      >
        {selectedDay && selectedData ? (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 border-b border-border pb-3">
              <p className="text-xs text-muted-foreground">Selected day</p>
              <h3 className="text-lg font-bold text-foreground">
                {format(selectedDay, "EEEE, MMM d")}
              </h3>
              {selectedData.stopNames.length > 0 && (
                <p className="text-sm text-primary font-medium">
                  📍 {selectedData.stopNames.join(", ")}
                </p>
              )}
            </div>

            {selectedData.activities.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <span className="text-3xl">😴</span>
                <p className="text-sm text-muted-foreground">No activities on this day</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {selectedData.activities.length} {selectedData.activities.length === 1 ? "activity" : "activities"}
                </p>
                {selectedData.activities.map((act, i) => (
                  <ActivityBlock key={act.id} activity={act} index={i} compact />
                ))}
                {selectedData.activities.some((a) => a.cost > 0) && (
                  <div className="mt-2 flex items-center justify-between rounded-xl bg-muted/30 px-3 py-2">
                    <span className="text-xs text-muted-foreground">Day total</span>
                    <span className="text-sm font-bold text-foreground">
                      {currency} {selectedData.activities.reduce((acc, a) => acc + a.cost, 0).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/40 py-12 text-center">
            <span className="mb-3 text-4xl">👆</span>
            <p className="text-sm font-medium text-foreground">Click a day</p>
            <p className="text-xs text-muted-foreground">to see activities</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
