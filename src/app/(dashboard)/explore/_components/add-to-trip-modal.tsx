"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MapPin, Plus, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CityData } from "@/lib/cities-data";
import { addCityToTrip } from "../actions";

interface Trip {
  id: string;
  title: string;
  status: string;
  _count: { stops: number };
}

interface AddToTripModalProps {
  city: CityData;
  trips: Trip[];
  open: boolean;
  onClose: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT:     "bg-muted text-muted-foreground",
  PLANNED:   "bg-primary/10 text-primary",
  ONGOING:   "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  COMPLETED: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

export function AddToTripModal({ city, trips, open, onClose }: AddToTripModalProps) {
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) { setSelectedTripId(null); setSuccess(false); }
  }, [open]);

  function handleAdd() {
    if (!selectedTripId) return;
    startTransition(async () => {
      const result = await addCityToTrip(selectedTripId, city);
      if (result.error) {
        toast.error(result.error);
      } else {
        setSuccess(true);
        toast.success(`${city.name} added to your trip!`);
        setTimeout(onClose, 1200);
      }
    });
  }

  const activeTripCount = trips.filter((t) => t.status !== "COMPLETED").length;

  return (
    <AnimatePresence>
      {open && (
        <>
          {}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-x-4 top-[15%] z-50 mx-auto max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/20 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full"
          >
            {}
            <div className={cn("relative overflow-hidden px-6 py-5 bg-linear-to-br", city.gradient)}>
              <div aria-hidden className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{city.emoji}</span>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Add {city.name}</h2>
                    <p className="text-xs text-muted-foreground">{city.country} · {city.region}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-black/10 hover:text-foreground transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {}
            <div className="p-6">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3 py-6 text-center"
                >
                  <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10">
                    <CheckCircle2 className="size-7 text-emerald-500" />
                  </div>
                  <p className="font-semibold text-foreground">{city.name} added!</p>
                  <p className="text-sm text-muted-foreground">Redirecting…</p>
                </motion.div>
              ) : trips.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <span className="text-4xl">✈️</span>
                  <div>
                    <p className="font-semibold text-foreground">No trips yet</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Create a trip first, then add cities to it.
                    </p>
                  </div>
                  <Link
                    href="/trips/new"
                    onClick={onClose}
                    className={cn(buttonVariants(), "gap-2")}
                  >
                    <Plus className="size-4" />
                    Create a trip
                  </Link>
                </div>
              ) : (
                <>
                  <p className="mb-4 text-sm font-semibold text-foreground">
                    Choose a trip to add {city.name} to:
                  </p>

                  <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                    {trips.map((trip) => (
                      <button
                        key={trip.id}
                        onClick={() => setSelectedTripId(trip.id)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all",
                          selectedTripId === trip.id
                            ? "border-primary bg-primary/8 shadow-sm"
                            : "border-border hover:border-primary/30 hover:bg-muted/50",
                        )}
                      >
                        {}
                        <div className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                          selectedTripId === trip.id
                            ? "border-primary bg-primary"
                            : "border-border",
                        )}>
                          {selectedTripId === trip.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="size-2 rounded-full bg-primary-foreground"
                            />
                          )}
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col">
                          <p className="font-semibold text-foreground text-sm truncate">{trip.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {trip._count.stops} {trip._count.stops === 1 ? "stop" : "stops"}
                          </p>
                        </div>

                        <span className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          STATUS_COLORS[trip.status] ?? STATUS_COLORS.DRAFT,
                        )}>
                          {trip.status.charAt(0) + trip.status.slice(1).toLowerCase()}
                        </span>
                      </button>
                    ))}
                  </div>

                  {}
                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={onClose}
                      className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAdd}
                      disabled={!selectedTripId || isPending}
                      className={cn(buttonVariants(), "flex-1 gap-2")}
                    >
                      {isPending ? (
                        <><Loader2 className="size-4 animate-spin" /> Adding…</>
                      ) : (
                        <><MapPin className="size-4" /> Add to trip</>
                      )}
                    </button>
                  </div>

                  {}
                  <div className="mt-3 text-center">
                    <Link
                      href={`/trips/new?destination=${encodeURIComponent(city.name)}`}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Plus className="size-3" />
                      Or create a new trip with {city.name}
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
