"use client";

import { motion } from "motion/react";
import { Users, Globe, TrendingUp, Star } from "lucide-react";

const STATS = [
  { value: "10K+",  label: "Trips planned",    icon: TrendingUp },
  { value: "150+",  label: "Countries covered", icon: Globe },
  { value: "$2M+",  label: "Budgets tracked",   icon: TrendingUp },
  { value: "4.9",   label: "Average rating",    icon: Star },
];

export function Stats() {
  return (
    <section className="border-y border-border bg-muted/20 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <stat.icon className="size-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground sm:text-4xl">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
