"use client";

import { motion } from "motion/react";
import { PlusCircle, MapPin, Zap, DollarSign, Package, Share2 } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: PlusCircle,
    title: "Create your trip",
    description: "Give your trip a name, set travel dates, choose currency, and add a cover photo. Takes 30 seconds.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    step: "02",
    icon: MapPin,
    title: "Add your stops",
    description: "Search cities and add them as stops. Set arrival and departure dates, nights, and notes per city.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    step: "03",
    icon: Zap,
    title: "Plan activities",
    description: "Browse curated activities or add your own. Assign them to stops with dates, times, and costs.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    step: "04",
    icon: DollarSign,
    title: "Track your budget",
    description: "Log expenses, view Recharts breakdowns, and generate a professional invoice with tax and totals.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    step: "05",
    icon: Package,
    title: "Pack & take notes",
    description: "Use the packing checklist with 22 default items and write trip notes or journal entries per stop.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    step: "06",
    icon: Share2,
    title: "Share your adventure",
    description: "Generate a public link and share your full itinerary. Viewers see everything without signing up.",
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24 bg-muted/30">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-sm font-medium text-primary">
            Simple by design
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            From idea to adventure{" "}
            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              in 6 steps
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            No tutorials needed. Traveloop is intuitive enough to start using immediately.
          </p>
        </motion.div>

        <div className="relative">
          <div aria-hidden
            className="absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-px -translate-x-1/2 bg-linear-to-b from-primary/30 via-primary/20 to-transparent lg:block" />

          <div className="grid gap-6 lg:grid-cols-2">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
              >
                <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${step.bg}`}>
                  <step.icon className={`size-6 ${step.color}`} />
                </div>
                <div>
                  <div className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Step {step.step}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
