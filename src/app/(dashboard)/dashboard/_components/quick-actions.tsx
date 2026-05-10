"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Plus, Compass, Map, Users, Zap } from "lucide-react";

const ACTIONS = [
  {
    icon: Plus,
    label: "Plan a Trip",
    description: "Start a new itinerary",
    href: "/trips/new",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20 hover:border-primary/40",
  },
  {
    icon: Compass,
    label: "Explore",
    description: "Discover destinations",
    href: "/explore",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20 hover:border-violet-500/40",
  },
  {
    icon: Map,
    label: "My Trips",
    description: "View all your trips",
    href: "/trips",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
  },
  {
    icon: Users,
    label: "Share",
    description: "Invite travel buddies",
    href: "/trips",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20 hover:border-amber-500/40",
  },
];

export function QuickActions() {
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4 flex items-center gap-2"
      >
        <Zap className="size-4 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Quick Actions</h2>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ACTIONS.map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            whileHover={{ y: -3 }}
          >
            <Link
              href={action.href}
              className={`group flex flex-col items-center gap-3 rounded-2xl border ${action.border} bg-card p-5 text-center transition-all duration-200 hover:shadow-md`}
            >
              <div className={`flex size-12 items-center justify-center rounded-xl ${action.bg} transition-transform duration-200 group-hover:scale-110`}>
                <action.icon className={`size-6 ${action.color}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
