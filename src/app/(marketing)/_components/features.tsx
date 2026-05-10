"use client";

import { motion } from "motion/react";
import {
  MapPin, DollarSign, Calendar, Share2,
  Search, BarChart3, Globe, Zap,
  Package, FileText, Receipt, ClipboardList,
} from "lucide-react";

const FEATURES = [
  {
    icon: MapPin,
    title: "Multi-city itineraries",
    description: "Add unlimited stops, drag to reorder, set arrival and departure dates, and track nights at each destination.",
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
    description: "See your entire journey laid out day by day across Timeline, List, and Calendar views.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Search,
    title: "Discover activities",
    description: "Browse 20+ curated activities across 10 categories. Add them to your itinerary with one click.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: Share2,
    title: "Share your plans",
    description: "Generate a public link to share your full itinerary. Viewers don't need an account.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: BarChart3,
    title: "Budget breakdown",
    description: "Recharts-powered pie and bar charts show exactly where your money goes across all stops.",
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  {
    icon: Package,
    title: "Packing checklist",
    description: "Track everything you need to pack. 9 categories, essential flags, progress bar, and default item seeding.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: FileText,
    title: "Trip notes & journal",
    description: "Write notes per trip or per stop. Pin important ones, color-code them, and group by date or city.",
    color: "text-teal-500",
    bg: "bg-teal-500/10",
  },
  {
    icon: Receipt,
    title: "Expense invoice",
    description: "Auto-generate a professional invoice from all activities and expenses with tax, discount, and grand total.",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    icon: Globe,
    title: "City explorer",
    description: "Browse 20 curated destinations across 6 regions with cost index, ratings, and best travel months.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    icon: ClipboardList,
    title: "Trip roadmap",
    description: "See all your trips on a Gantt-style horizontal timeline. Status auto-syncs based on travel dates.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    icon: Zap,
    title: "Lightning fast",
    description: "Built on Next.js 16 with server components, Turbopack, and real-time search. Pages load instantly.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
];

export function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
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
            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              reimagined
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            From dreaming to packing — Traveloop gives you every tool to plan the perfect trip without the spreadsheet chaos.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
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
