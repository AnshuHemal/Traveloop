"use client";

import { motion } from "motion/react";
import {
  MapPin, DollarSign, Calendar, Share2,
  Search, BarChart3, Globe, Zap,
} from "lucide-react";

const FEATURES = [
  {
    icon: MapPin,
    title: "Multi-city itineraries",
    description: "Add unlimited stops to your trip. Drag to reorder, set arrival/departure dates, and track nights at each destination.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    icon: DollarSign,
    title: "Auto budget tracking",
    description: "Every activity and expense is automatically tallied. See your total cost broken down by category in real time.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Calendar,
    title: "Visual timeline",
    description: "See your entire journey laid out day by day. Activities slot into your calendar so you never double-book.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Search,
    title: "Discover activities",
    description: "Search cities and browse curated activities. Add them to your itinerary with one click and see the cost impact instantly.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: Share2,
    title: "Share your plans",
    description: "Generate a public link to share your trip with friends and family. They can view your full itinerary without signing up.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: BarChart3,
    title: "Budget breakdown",
    description: "Visual charts show exactly where your money goes — accommodation, food, transport, activities, and more.",
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  {
    icon: Globe,
    title: "Any destination",
    description: "Plan trips to any city in the world. Our destination database covers thousands of cities across every continent.",
    color: "text-teal-500",
    bg: "bg-teal-500/10",
  },
  {
    icon: Zap,
    title: "Lightning fast",
    description: "Built on Next.js 16 with server components. Pages load instantly and updates happen in real time.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];

export function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-sm font-medium text-primary">
            Everything you need
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Travel planning,{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              reimagined
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            From dreaming to booking — Traveloop gives you every tool to plan the perfect trip without the spreadsheet chaos.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className={`mb-4 inline-flex size-11 items-center justify-center rounded-xl ${feature.bg}`}>
                <feature.icon className={`size-5 ${feature.color}`} />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
