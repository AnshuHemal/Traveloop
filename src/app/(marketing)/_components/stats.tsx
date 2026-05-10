"use client";

import { motion } from "motion/react";

const STATS = [
  { value: "10K+", label: "Trips planned" },
  { value: "150+", label: "Countries covered" },
  { value: "$2M+", label: "Budgets tracked" },
  { value: "4.9★", label: "Average rating" },
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
              className="text-center"
            >
              <div className="text-3xl font-bold text-foreground sm:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
