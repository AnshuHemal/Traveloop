"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Plus, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyTrips() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50 px-8 py-20 text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1, type: "spring", stiffness: 200 }}
        className="mb-5 flex size-20 items-center justify-center rounded-2xl bg-primary/10"
      >
        <MapPin className="size-10 text-primary" />
      </motion.div>

      <h3 className="mb-2 text-xl font-bold text-foreground">No trips yet</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground leading-relaxed">
        Your next adventure is waiting. Create your first trip and start building your dream itinerary.
      </p>

      <Link
        href="/trips/new"
        className={cn(buttonVariants(), "gap-2")}
      >
        <Plus className="size-4" />
        Plan your first trip
      </Link>
    </motion.div>
  );
}
