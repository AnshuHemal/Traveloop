"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Search, Plus, X, MapPin, ArrowRight, Loader2, Plane, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchResult {
  trips: { id: string; title: string; status: string; _count: { stops: number } }[];
  stops: { id: string; cityName: string; countryName: string; trip: { id: string; title: string } }[];
  activities: { id: string; name: string; category: string; stop: { cityName: string; trip: { id: string; title: string } } }[];
}

const CATEGORY_EMOJI: Record<string, string> = {
  SIGHTSEEING: "🏛️", FOOD: "🍜", TRANSPORT: "✈️", ACCOMMODATION: "🏨",
  ADVENTURE: "🧗", CULTURE: "🎭", SHOPPING: "🛍️", NIGHTLIFE: "🌃",
  WELLNESS: "🧘", OTHER: "📌",
};

interface DashboardHeroProps {
  userName: string;
  tripCount: number;
}

export function DashboardHero({ userName, tripCount }: DashboardHeroProps) {
  const [query, setQuery]       = useState("");
  const [focused, setFocused]   = useState(false);
  const [results, setResults]   = useState<SearchResult | null>(null);
  const [loading, setLoading]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasResults = results && (
    results.trips.length > 0 || results.stops.length > 0 || results.activities.length > 0
  );
  const showDropdown = focused && query.length >= 2;

  const fetchResults = useCallback(async (q: string) => {
    if (q.length < 2) { setResults(null); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) setResults(await res.json());
    } catch {  }
    setLoading(false);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchResults(val), 300);
  }

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!(e.target as Element).closest("[data-search-container]")) setFocused(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary/90 to-primary/70 px-6 py-10 sm:px-10 sm:py-14">
        {}
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-12 left-1/3 size-48 rounded-full bg-white/8 blur-2xl" />

        {}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="absolute right-6 top-6 hidden flex-col gap-2 sm:flex"
        >
          {["🗼 Paris", "🏝️ Bali", "🗾 Tokyo"].map((pill, i) => (
            <motion.span
              key={pill}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
            >
              {pill}
            </motion.span>
          ))}
        </motion.div>

        <div className="relative max-w-xl">
          <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="mb-1 text-sm font-medium text-white/70">
            {greeting}, {userName} 👋
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.08 }}
            className="mb-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Where to next?
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}
            className="mb-7 text-sm text-white/70">
            {tripCount > 0
              ? `You have ${tripCount} trip${tripCount !== 1 ? "s" : ""} planned. Keep exploring.`
              : "Start planning your dream adventure today."}
          </motion.p>

          {}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            data-search-container className="relative">
            <div className={cn(
              "flex items-center gap-3 rounded-xl bg-white/95 px-4 py-3 shadow-lg shadow-black/20 transition-all duration-200",
              focused && "ring-2 ring-white/50",
            )}>
              {loading ? (
                <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
              ) : (
                <Search className="size-4 shrink-0 text-muted-foreground" />
              )}
              <input
                ref={inputRef}
                type="text"
                placeholder="Search your trips, cities, activities…"
                value={query}
                onChange={handleChange}
                onFocus={() => setFocused(true)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              {query && (
                <button onClick={() => { setQuery(""); setResults(null); inputRef.current?.focus(); }}
                  className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="size-4" />
                </button>
              )}
            </div>

            {}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-popover shadow-xl shadow-black/10"
                >
                  {loading && !results ? (
                    <div className="flex items-center gap-2 px-4 py-4 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" /> Searching…
                    </div>
                  ) : !hasResults ? (
                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                      No results for &ldquo;{query}&rdquo;
                    </div>
                  ) : (
                    <div className="p-1.5 max-h-80 overflow-y-auto">
                      {}
                      {results!.trips.length > 0 && (
                        <>
                          <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Trips</p>
                          {results!.trips.map((t) => (
                            <Link key={t.id} href={`/trips/${t.id}`} onClick={() => setFocused(false)}
                              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent transition-colors">
                              <Plane className="size-4 text-primary shrink-0" />
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate">{t.title}</p>
                                <p className="text-xs text-muted-foreground">{t._count.stops} stops · {t.status.toLowerCase()}</p>
                              </div>
                            </Link>
                          ))}
                        </>
                      )}
                      {}
                      {results!.stops.length > 0 && (
                        <>
                          <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Cities</p>
                          {results!.stops.map((s) => (
                            <Link key={s.id} href={`/trips/${s.trip.id}`} onClick={() => setFocused(false)}
                              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent transition-colors">
                              <MapPin className="size-4 text-primary shrink-0" />
                              <div className="min-w-0">
                                <p className="font-medium text-foreground">{s.cityName}</p>
                                <p className="text-xs text-muted-foreground">{s.countryName} · in {s.trip.title}</p>
                              </div>
                            </Link>
                          ))}
                        </>
                      )}
                      {}
                      {results!.activities.length > 0 && (
                        <>
                          <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Activities</p>
                          {results!.activities.map((a) => (
                            <Link key={a.id} href={`/trips/${a.stop.trip.id}`} onClick={() => setFocused(false)}
                              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent transition-colors">
                              <span className="text-base shrink-0">{CATEGORY_EMOJI[a.category] ?? "📌"}</span>
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate">{a.name}</p>
                                <p className="text-xs text-muted-foreground">{a.stop.cityName} · {a.stop.trip.title}</p>
                              </div>
                            </Link>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}
            className="mt-4 flex flex-wrap items-center gap-2">
            <Link href="/trips/new" className={cn(buttonVariants({ size: "sm" }),
              "gap-1.5 bg-white text-primary hover:bg-white/90 font-semibold shadow-sm")}>
              <Plus className="size-3.5" />
              Plan a trip
            </Link>
            <Link href="/explore"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white/90 hover:bg-white/10 transition-colors">
              Explore destinations
              <ArrowRight className="size-3.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
