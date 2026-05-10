"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "motion/react";
import { Plus, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StopCard } from "./stop-card";
import { AddStopModal } from "./add-stop-modal";
import { reorderStops } from "../actions";
import { formatCurrency } from "@/lib/currency";

interface Stop {
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
  expenses?: { amount: number }[];
}

interface ItineraryBuilderProps {
  tripId: string;
  tripCurrency: string;
  initialStops: Stop[];
  defaultDestination?: string;
}

export function ItineraryBuilder({
  tripId,
  tripCurrency,
  initialStops,
  defaultDestination,
}: ItineraryBuilderProps) {
  const [stops, setStops] = useState<Stop[]>(initialStops);
  const [showAddStop, setShowAddStop] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  const handleReorder = useCallback(
    async (newOrder: Stop[]) => {
      setStops(newOrder);
      setIsReordering(true);
      const result = await reorderStops(
        tripId,
        newOrder.map((s) => s.id),
      );
      setIsReordering(false);
      if (result.error) toast.error(result.error);
    },
    [tripId],
  );

  const totalBudget = stops.reduce(
    (acc, stop) =>
      acc +
      stop.activities.reduce((a, act) => a + act.cost, 0) +
      (stop.expenses ?? []).reduce((a, e) => a + e.amount, 0),
    0,
  );

  const totalActivities = stops.reduce((acc, s) => acc + s.activities.length, 0);
  const totalNights = stops.reduce((acc, s) => acc + s.nights, 0);

  return (
    <div className="flex flex-col gap-6">

      {/* Summary bar */}
      {stops.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3"
        >
          <div className="flex items-center gap-1.5 text-sm">
            <MapPin className="size-4 text-primary" />
            <span className="font-semibold text-foreground">{stops.length}</span>
            <span className="text-muted-foreground">{stops.length === 1 ? "stop" : "stops"}</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-lg">🌙</span>
            <span className="font-semibold text-foreground">{totalNights}</span>
            <span className="text-muted-foreground">nights</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5 text-sm">
            <Sparkles className="size-4 text-primary" />
            <span className="font-semibold text-foreground">{totalActivities}</span>
            <span className="text-muted-foreground">{totalActivities === 1 ? "activity" : "activities"}</span>
          </div>
          {totalBudget > 0 && (
            <>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5 text-sm">
                <span className="text-lg">💰</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(totalBudget, tripCurrency)}
                </span>
                <span className="text-muted-foreground">estimated</span>
              </div>
            </>
          )}
          {isReordering && (
            <span className="ml-auto text-xs text-muted-foreground animate-pulse">
              Saving order…
            </span>
          )}
        </motion.div>
      )}

      {/* Stops list with drag-to-reorder */}
      {stops.length === 0 ? (
        <EmptyItinerary onAddStop={() => setShowAddStop(true)} />
      ) : (
        <>
          <Reorder.Group
            axis="y"
            values={stops}
            onReorder={handleReorder}
            className="flex flex-col gap-4"
          >
            <AnimatePresence>
              {stops.map((stop, i) => (
                <Reorder.Item
                  key={stop.id}
                  value={stop}
                  className="cursor-default list-none"
                >
                  <StopCard
                    stop={stop}
                    tripId={tripId}
                    tripCurrency={tripCurrency}
                    index={i}
                  />
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>

          {/* Route connector hint */}
          {stops.length > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-2 text-xs text-muted-foreground"
            >
              <div className="h-px flex-1 bg-border" />
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1">
                <ArrowRight className="size-3" />
                Drag stops to reorder your route
              </span>
              <div className="h-px flex-1 bg-border" />
            </motion.div>
          )}

          {/* Add another stop */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => setShowAddStop(true)}
              className={cn(
                "w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-5 text-sm font-semibold text-muted-foreground",
                "hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all duration-200",
              )}
            >
              <Plus className="size-5" />
              Add another stop
            </button>
          </motion.div>
        </>
      )}

      {/* Add stop modal */}
      <AddStopModal
        tripId={tripId}
        open={showAddStop}
        onClose={() => setShowAddStop(false)}
        defaultDestination={defaultDestination}
      />
    </div>
  );
}

function EmptyItinerary({ onAddStop }: { onAddStop: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/40 px-8 py-16 text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="mb-5 text-6xl"
      >
        🗺️
      </motion.div>
      <h3 className="mb-2 text-xl font-bold text-foreground">No stops yet</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground leading-relaxed">
        Add cities to your itinerary. Each stop can have its own dates, activities, and budget.
      </p>
      <button
        onClick={onAddStop}
        className={cn(buttonVariants(), "gap-2")}
      >
        <Plus className="size-4" />
        Add your first stop
      </button>
    </motion.div>
  );
}
