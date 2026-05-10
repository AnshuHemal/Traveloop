"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin, Calendar, Moon, Trash2, Plus,
  ChevronDown, ChevronUp, GripVertical,
  Loader2, FileText, DollarSign, Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { deleteStop } from "../actions";
import { ActivityItem } from "./activity-item";
import { AddActivityModal } from "./add-activity-modal";
import { EditStopModal } from "./edit-stop-modal";

const DESTINATION_EMOJIS: Record<string, string> = {
  France: "🗼", Italy: "🏛️", Spain: "🎨", Portugal: "🌊",
  Japan: "🗾", Thailand: "🏯", Greece: "🏝️", Germany: "🏰",
  USA: "🗽", UK: "🎡", Australia: "🦘", India: "🕌",
  Indonesia: "🌴", UAE: "🏙️", Mexico: "🌮", Brazil: "🌿",
  Netherlands: "🌷", Turkey: "🕌", Singapore: "🦁",
  "Czech Republic": "🏰",
};

const STOP_GRADIENTS = [
  "from-primary/15 via-primary/8 to-transparent",
  "from-violet-500/15 via-violet-500/8 to-transparent",
  "from-emerald-500/15 via-emerald-500/8 to-transparent",
  "from-amber-500/15 via-amber-500/8 to-transparent",
  "from-rose-500/15 via-rose-500/8 to-transparent",
  "from-sky-500/15 via-sky-500/8 to-transparent",
];

interface StopCardProps {
  stop: {
    id: string;
    cityName: string;
    countryName: string;
    arrivalDate: Date | null;
    departureDate: Date | null;
    nights: number;
    notes: string | null;
    order: number;
    activities: {
      id: string;
      name: string;
      description: string | null;
      category: string;
      date: Date | null;
      startTime: string | null;
      endTime: string | null;
      cost: number;
      currency: string;
      booked: boolean;
    }[];
  };
  tripId: string;
  tripCurrency: string;
  index: number;
}

export function StopCard({
  stop, tripId, tripCurrency, index,
}: StopCardProps) {
  const [expanded, setExpanded] = useState(true);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showEditStop, setShowEditStop] = useState(false);
  const [isPending, startTransition] = useTransition();

  const emoji = DESTINATION_EMOJIS[stop.countryName] ?? "📍";
  const gradient = STOP_GRADIENTS[index % STOP_GRADIENTS.length];

  const totalCost = stop.activities.reduce((acc, a) => acc + a.cost, 0);
  const bookedCount = stop.activities.filter((a) => a.booked).length;

  const dateRange = stop.arrivalDate && stop.departureDate
    ? `${format(new Date(stop.arrivalDate), "MMM d")} – ${format(new Date(stop.departureDate), "MMM d, yyyy")}`
    : stop.arrivalDate
      ? `From ${format(new Date(stop.arrivalDate), "MMM d, yyyy")}`
      : null;

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteStop(stop.id, tripId);
      if (result.error) toast.error(result.error);
      else toast.success(`${stop.cityName} removed`);
    });
  }

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20, height: 0 }}
        transition={{ duration: 0.35, delay: index * 0.06 }}
        className={cn(
          "overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200",
          "hover:border-primary/20 hover:shadow-md hover:shadow-primary/5",
        )}
      >
        {/* Stop header */}
        <div className={cn("relative bg-linear-to-br", gradient)}>
          <div className="flex items-center gap-3 px-5 py-4">
            {/* Drag handle */}
            <div
              className="flex size-8 shrink-0 cursor-grab items-center justify-center rounded-lg text-muted-foreground/50 hover:bg-black/5 hover:text-muted-foreground transition-colors active:cursor-grabbing"
              title="Drag to reorder"
            >
              <GripVertical className="size-4" />
            </div>

            {/* Stop number */}
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-background/80 text-sm font-bold text-foreground backdrop-blur-sm shadow-sm">
              {index + 1}
            </div>

            {/* Emoji */}
            <span className="text-3xl">{emoji}</span>

            {/* City info */}
            <div className="flex min-w-0 flex-1 flex-col">
              <h3 className="font-bold text-foreground text-base leading-tight">
                {stop.cityName}
              </h3>
              <p className="text-xs text-muted-foreground">{stop.countryName}</p>
            </div>

            {/* Meta badges */}
            <div className="hidden flex-wrap items-center gap-2 sm:flex">
              {dateRange && (
                <span className="flex items-center gap-1 rounded-full bg-background/70 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                  <Calendar className="size-3 text-primary" />
                  {dateRange}
                </span>
              )}
              <span className="flex items-center gap-1 rounded-full bg-background/70 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                <Moon className="size-3 text-primary" />
                {stop.nights}n
              </span>
              {totalCost > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-background/70 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                  <DollarSign className="size-3 text-primary" />
                  {totalCost.toLocaleString()}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowEditStop(true)}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-black/10 hover:text-foreground transition-colors"
                title="Edit stop"
              >
                <Pencil className="size-4" />
              </button>
              <button
                onClick={() => setExpanded((v) => !v)}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-black/10 hover:text-foreground transition-colors"
                title={expanded ? "Collapse" : "Expand"}
              >
                {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-colors"
                title="Remove stop"
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile meta row */}
          {(dateRange || stop.nights) && (
            <div className="flex flex-wrap gap-2 px-5 pb-3 sm:hidden">
              {dateRange && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="size-3 text-primary" />
                  {dateRange}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Moon className="size-3 text-primary" />
                {stop.nights} night{stop.nights !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Expandable body */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-4">
                {/* Notes */}
                {stop.notes && (
                  <div className="mb-4 flex items-start gap-2 rounded-xl bg-muted/40 px-3 py-2.5">
                    <FileText className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground leading-relaxed">{stop.notes}</p>
                  </div>
                )}

                {/* Activities header */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">Activities</span>
                    {stop.activities.length > 0 && (
                      <Badge variant="secondary" className="text-[10px]">
                        {stop.activities.length}
                      </Badge>
                    )}
                    {bookedCount > 0 && (
                      <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">
                        {bookedCount} booked
                      </Badge>
                    )}
                  </div>
                  <button
                    onClick={() => setShowAddActivity(true)}
                    className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/8 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/15 transition-colors"
                  >
                    <Plus className="size-3.5" />
                    Add activity
                  </button>
                </div>

                {/* Activities list */}
                {stop.activities.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border py-8 text-center"
                  >
                    <span className="text-3xl">🎯</span>
                    <p className="text-sm font-medium text-foreground">No activities yet</p>
                    <p className="text-xs text-muted-foreground">
                      Add sightseeing, food, transport, and more
                    </p>
                    <button
                      onClick={() => setShowAddActivity(true)}
                      className="mt-1 flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Plus className="size-3.5" />
                      Add first activity
                    </button>
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    <div className="flex flex-col gap-2">
                      {stop.activities
                        .sort((a, b) => {
                          if (a.date && b.date) return new Date(a.date).getTime() - new Date(b.date).getTime();
                          return 0;
                        })
                        .map((activity, i) => (
                          <ActivityItem
                            key={activity.id}
                            activity={activity}
                            tripId={tripId}
                            stopName={stop.cityName}
                            index={i}
                          />
                        ))}
                    </div>
                  </AnimatePresence>
                )}

                {/* Stop budget summary */}
                {totalCost > 0 && (
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/30 px-4 py-2.5">
                    <span className="text-xs text-muted-foreground">Stop total</span>
                    <span className="text-sm font-bold text-foreground">
                      {tripCurrency} {totalCost.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Add activity modal */}
      <AddActivityModal
        stopId={stop.id}
        tripId={tripId}
        stopName={stop.cityName}
        open={showAddActivity}
        onClose={() => setShowAddActivity(false)}
      />

      {/* Edit stop modal */}
      <EditStopModal
        stop={stop}
        tripId={tripId}
        open={showEditStop}
        onClose={() => setShowEditStop(false)}
      />
    </>
  );
}
