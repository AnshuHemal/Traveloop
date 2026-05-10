"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Search, Plus, X, MapPin, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SEARCH_SUGGESTIONS = [
  { city: "Paris", country: "France", emoji: "🗼" },
  { city: "Tokyo", country: "Japan", emoji: "🗾" },
  { city: "Bali", country: "Indonesia", emoji: "🌴" },
  { city: "New York", country: "USA", emoji: "🗽" },
  { city: "Rome", country: "Italy", emoji: "🏛️" },
  { city: "Barcelona", country: "Spain", emoji: "🎨" },
  { city: "Santorini", country: "Greece", emoji: "🏝️" },
  { city: "Dubai", country: "UAE", emoji: "🏙️" },
];

interface DashboardHeroProps {
  userName: string;
  tripCount: number;
}

export function DashboardHero({ userName, tripCount }: DashboardHeroProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.length > 0
    ? SEARCH_SUGGESTIONS.filter(
        (s) =>
          s.city.toLowerCase().includes(query.toLowerCase()) ||
          s.country.toLowerCase().includes(query.toLowerCase()),
      )
    : SEARCH_SUGGESTIONS.slice(0, 5);

  const showDropdown = focused && (query.length > 0 || filtered.length > 0);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!(e.target as Element).closest("[data-search-container]")) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Animated gradient background */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary/90 to-primary/70 px-6 py-10 sm:px-10 sm:py-14">

        {/* Decorative blobs */}
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-12 left-1/3 size-48 rounded-full bg-white/8 blur-2xl" />
        <div aria-hidden className="pointer-events-none absolute right-1/4 top-1/2 size-32 rounded-full bg-white/6 blur-xl" />

        {/* Floating destination pills */}
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

        {/* Content */}
        <div className="relative max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-1 text-sm font-medium text-white/70"
          >
            {greeting}, {userName} 👋
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="mb-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Where to next?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
            className="mb-7 text-sm text-white/70"
          >
            {tripCount > 0
              ? `You have ${tripCount} trip${tripCount !== 1 ? "s" : ""} planned. Keep exploring.`
              : "Start planning your dream adventure today."}
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            data-search-container
            className="relative"
          >
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl bg-white/95 px-4 py-3 shadow-lg shadow-black/20 transition-all duration-200",
                focused && "ring-2 ring-white/50",
              )}
            >
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search destinations, cities, countries…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              {query && (
                <button
                  onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Dropdown */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-popover shadow-xl shadow-black/10"
                >
                  {filtered.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                      No destinations found for &ldquo;{query}&rdquo;
                    </div>
                  ) : (
                    <div className="p-1.5">
                      {filtered.map((s) => (
                        <Link
                          key={s.city}
                          href={`/trips/new?destination=${encodeURIComponent(s.city)}`}
                          onClick={() => setFocused(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent transition-colors"
                        >
                          <span className="text-xl">{s.emoji}</span>
                          <div>
                            <p className="font-medium text-foreground">{s.city}</p>
                            <p className="text-xs text-muted-foreground">{s.country}</p>
                          </div>
                          <MapPin className="ml-auto size-3.5 text-muted-foreground" />
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Quick action buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38 }}
            className="mt-4 flex flex-wrap items-center gap-2"
          >
            <Link
              href="/trips/new"
              className={cn(
                buttonVariants({ size: "sm" }),
                "gap-1.5 bg-white text-primary hover:bg-white/90 font-semibold shadow-sm",
              )}
            >
              <Plus className="size-3.5" />
              Plan a trip
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
            >
              Explore destinations
              <ArrowRight className="size-3.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
