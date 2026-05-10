"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Plus, Clock, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TripCard } from "./trip-card";

interface Trip {
  id: string;
  title: string;
  description: string | null;
  status: string;
  visibility: string;
  currency: string;
  startDate: Date | null;
  endDate: Date | null;
  _count: { stops: number };
  stops: { cityName: string; countryName: string }[];
}

interface RecentTripsSectionProps {
  trips: Trip[];
  totalCount: number;
}

export function RecentTripsSection({ trips, totalCount }: RecentTripsSectionProps) {
  return (
    <section>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Previous Trips</h2>
          {totalCount > 0 && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {totalCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {totalCount > 3 && (
            <Link
              href="/trips"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          )}
          <Link
            href="/trips/new"
            className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
          >
            <Plus className="size-3.5" />
            Plan a trip
          </Link>
        </div>
      </motion.div>

      {/* Trip grid */}
      {trips.length === 0 ? (
        <EmptyTripsInline />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip, i) => (
            <TripCard key={trip.id} trip={trip} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyTripsInline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/40 px-8 py-14 text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="mb-4 text-5xl"
      >
        ✈️
      </motion.div>
      <h3 className="mb-1.5 text-base font-bold text-foreground">No trips yet</h3>
      <p className="mb-5 max-w-xs text-sm text-muted-foreground leading-relaxed">
        Your adventures start here. Plan your first trip and build your dream itinerary.
      </p>
      <Link href="/trips/new" className={cn(buttonVariants(), "gap-2")}>
        <Plus className="size-4" />
        Plan your first trip
      </Link>
    </motion.div>
  );
}
