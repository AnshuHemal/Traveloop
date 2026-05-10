"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, MapPin, Calendar, DollarSign, Share2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TRIP_STOPS = [
  { city: "Paris", country: "France", emoji: "🗼", nights: 3, color: "bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-400" },
  { city: "Rome", country: "Italy", emoji: "🏛️", nights: 4, color: "bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-400" },
  { city: "Barcelona", country: "Spain", emoji: "🎨", nights: 3, color: "bg-violet-500/15 border-violet-500/30 text-violet-700 dark:text-violet-400" },
  { city: "Lisbon", country: "Portugal", emoji: "🌊", nights: 2, color: "bg-sky-500/15 border-sky-500/30 text-sky-700 dark:text-sky-400" },
];

const BUDGET_ITEMS = [
  { label: "Accommodation", amount: 1240, icon: "🏨", pct: 42 },
  { label: "Activities", amount: 680, icon: "🎭", pct: 23 },
  { label: "Transport", amount: 520, icon: "✈️", pct: 18 },
  { label: "Food & Dining", amount: 500, icon: "🍽️", pct: 17 },
];

function TripMockup() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/10">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-3">
        <span className="size-2.5 rounded-full bg-red-400/70" />
        <span className="size-2.5 rounded-full bg-yellow-400/70" />
        <span className="size-2.5 rounded-full bg-emerald-400/70" />
        <div className="mx-auto flex items-center gap-2 rounded-md border border-border bg-background/60 px-3 py-1 text-[11px] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary/60" />
          traveloop.app/trips/europe-adventure
        </div>
      </div>

      <div className="p-5">
        {/* Trip header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">European Adventure</h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="size-3" />
              Jun 15 – Jul 3, 2025 · 18 days
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            4 cities
          </span>
        </div>

        {/* Stops */}
        <div className="mb-4 flex flex-col gap-2">
          {TRIP_STOPS.map((stop, i) => (
            <motion.div
              key={stop.city}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.35 }}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${stop.color}`}
            >
              <span className="text-lg">{stop.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{stop.city}</p>
                <p className="text-xs opacity-70">{stop.country}</p>
              </div>
              <div className="flex items-center gap-1 text-xs opacity-70">
                <MapPin className="size-3" />
                {stop.nights}n
              </div>
            </motion.div>
          ))}
        </div>

        {/* Budget breakdown */}
        <div className="rounded-xl border border-border bg-muted/30 p-3">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">Budget Breakdown</span>
            <span className="text-xs font-bold text-primary">$2,940 total</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {BUDGET_ITEMS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 + i * 0.08 }}
                className="flex items-center gap-2"
              >
                <span className="text-sm">{item.icon}</span>
                <span className="w-24 text-xs text-muted-foreground">{item.label}</span>
                <div className="flex-1 overflow-hidden rounded-full bg-border h-1.5">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ delay: 1.1 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <span className="w-12 text-right text-xs font-medium text-foreground">
                  ${item.amount}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-20 lg:pt-28">
      {/* Background effects */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/8 blur-[100px]" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[500px] rounded-full bg-primary/5 blur-[80px]" />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,transparent_30%,var(--background)_100%)]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Left: copy */}
          <div className="flex flex-col items-start gap-6">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-sm font-medium text-primary"
            >
              ✈️ Personalized travel planning made easy
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl">
                Plan trips.{" "}
                <span className="bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Live adventures.
                </span>
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
                Build multi-city itineraries, track budgets automatically, discover activities, and share your journey — all in one beautiful platform.
              </p>
            </motion.div>

            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.22 }}
              className="flex flex-wrap gap-2"
            >
              {[
                { icon: <MapPin className="size-3.5" />, label: "Multi-city itineraries" },
                { icon: <DollarSign className="size-3.5" />, label: "Auto budget tracking" },
                { icon: <Calendar className="size-3.5" />, label: "Visual timeline" },
                { icon: <Share2 className="size-3.5" />, label: "Share with friends" },
              ].map((pill) => (
                <span
                  key={pill.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {pill.icon}
                  {pill.label}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "gap-2 min-w-48 h-12 text-base font-semibold"
                )}
              >
                Start planning free
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "min-w-36 h-12 text-base"
                )}
              >
                Sign in
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="text-sm text-muted-foreground"
            >
              Free forever · No credit card required · 2 min setup
            </motion.p>
          </div>

          {/* Right: mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 3 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ perspective: 1200 }}
            className="relative"
          >
            <div aria-hidden className="absolute -inset-6 rounded-3xl bg-primary/5 blur-2xl" />
            <TripMockup />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
