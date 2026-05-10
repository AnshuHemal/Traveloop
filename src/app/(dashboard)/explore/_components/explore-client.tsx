"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CityData } from "@/lib/cities-data";
import { CityCard } from "./city-card";
import { AddToTripModal } from "./add-to-trip-modal";

interface Trip {
  id: string;
  title: string;
  status: string;
  _count: { stops: number };
}

interface ExploreClientProps {
  cities: CityData[];
  trips: Trip[];
}

export function ExploreClient({ cities, trips }: ExploreClientProps) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);

  return (
    <>
      {}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {cities.length === 0
            ? "No cities match your search"
            : `${cities.length} destination${cities.length !== 1 ? "s" : ""} found`}
        </p>
        <div className="flex overflow-hidden rounded-xl border border-border bg-muted/30 p-0.5">
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "flex size-8 items-center justify-center rounded-lg transition-all",
                view === v
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-label={`${v} view`}
            >
              {v === "grid" ? <LayoutGrid className="size-4" /> : <List className="size-4" />}
            </button>
          ))}
        </div>
      </div>

      {}
      <AnimatePresence mode="wait">
        {cities.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/40 py-20 text-center"
          >
            <span className="mb-4 text-5xl">🔍</span>
            <h3 className="mb-2 text-lg font-bold text-foreground">No cities found</h3>
            <p className="text-sm text-muted-foreground">Try a different search or clear your filters</p>
          </motion.div>
        ) : view === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {cities.map((city, i) => (
              <CityCard
                key={city.id}
                city={city}
                index={i}
                view="grid"
                onAddToTrip={setSelectedCity}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3"
          >
            {cities.map((city, i) => (
              <CityCard
                key={city.id}
                city={city}
                index={i}
                view="list"
                onAddToTrip={setSelectedCity}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <AddToTripModal
        city={selectedCity ?? { id: "", name: "", country: "", countryCode: "", region: "", emoji: "✈️", description: "", costIndex: 1, popularity: 1, avgDailyBudget: 0, bestMonths: [], tags: [], highlights: [], gradient: "" }}
        trips={trips}
        open={!!selectedCity}
        onClose={() => setSelectedCity(null)}
      />
    </>
  );
}
