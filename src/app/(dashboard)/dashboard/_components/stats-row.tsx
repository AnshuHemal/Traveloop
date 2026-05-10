"use client";

import { motion } from "motion/react";
import { MapPin, Globe, CheckCircle2, TrendingUp } from "lucide-react";

interface StatsRowProps {
  totalTrips: number;
  totalDestinations: number;
  completedTrips: number;
  ongoingTrips: number;
}

export function StatsRow({
  totalTrips,
  totalDestinations,
  completedTrips,
  ongoingTrips,
}: StatsRowProps) {
  const stats = [
    {
      icon: MapPin,
      label: "Total Trips",
      value: totalTrips,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
    {
      icon: Globe,
      label: "Destinations",
      value: totalDestinations,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    {
      icon: CheckCircle2,
      label: "Completed",
      value: completedTrips,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      icon: TrendingUp,
      label: "In Progress",
      value: ongoingTrips,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          className={`flex items-center gap-3 rounded-xl border ${stat.border} bg-card p-4 transition-all hover:shadow-sm`}
        >
          <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
            <stat.icon className={`size-5 ${stat.color}`} />
          </div>
          <div className="min-w-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              className="text-2xl font-bold tabular-nums text-foreground"
            >
              {stat.value}
            </motion.div>
            <div className="truncate text-xs text-muted-foreground">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
