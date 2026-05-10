"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Plus, Search, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TripsEmptyProps {
  hasFilters: boolean;
  onClearFilters?: () => void;
}

export function TripsEmpty({ hasFilters }: TripsEmptyProps) {
  if (hasFilters) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/40 px-8 py-16 text-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-muted"
        >
          <Search className="size-8 text-muted-foreground" />
        </motion.div>
        <h3 className="mb-1.5 text-base font-bold text-foreground">No trips match your filters</h3>
        <p className="mb-5 max-w-xs text-sm text-muted-foreground leading-relaxed">
          Try adjusting your search or filters to find what you&apos;re looking for.
        </p>
        <Link href="/trips" className={cn(buttonVariants({ variant: "outline" }))}>
          Clear all filters
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/40 px-8 py-20 text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="mb-5 flex size-20 items-center justify-center rounded-2xl bg-primary/10"
      >
        <MapPin className="size-10 text-primary" />
      </motion.div>
      <h3 className="mb-2 text-xl font-bold text-foreground">No trips yet</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground leading-relaxed">
        Your adventures start here. Plan your first trip and build your dream itinerary.
      </p>
      <Link href="/trips/new" className={cn(buttonVariants(), "gap-2")}>
        <Plus className="size-4" />
        Plan your first trip
      </Link>
    </motion.div>
  );
}
