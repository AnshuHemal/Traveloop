"use client";

import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Solo traveler",
    initials: "SC",
    color: "bg-rose-500/10 text-rose-600",
    rating: 5,
    text: "Traveloop replaced my messy spreadsheets completely. The budget tracker alone saved me from overspending on my Europe trip. The packing checklist is a game changer.",
  },
  {
    name: "Marcus Rivera",
    role: "Travel blogger",
    initials: "MR",
    color: "bg-primary/10 text-primary",
    rating: 5,
    text: "I've tried every travel app out there. Traveloop is the first one that actually covers the full journey — from planning to packing to sharing. The invoice feature is brilliant.",
  },
  {
    name: "Priya Sharma",
    role: "Family trip planner",
    initials: "PS",
    color: "bg-violet-500/10 text-violet-600",
    rating: 5,
    text: "Planning a 3-week Asia trip for 5 people used to be a nightmare. With Traveloop's multi-city builder and shared itinerary, everyone stayed on the same page.",
  },
  {
    name: "James O'Brien",
    role: "Business traveler",
    initials: "JO",
    color: "bg-amber-500/10 text-amber-600",
    rating: 5,
    text: "The expense invoice feature is exactly what I needed for work trips. Auto-generates a professional PDF with all my costs. My finance team loves it.",
  },
  {
    name: "Aiko Tanaka",
    role: "Adventure seeker",
    initials: "AT",
    color: "bg-emerald-500/10 text-emerald-600",
    rating: 5,
    text: "The trip notes journal is my favorite feature. I write down hotel check-in details, local contacts, and day reminders. It's like having a travel assistant in my pocket.",
  },
  {
    name: "Lena Müller",
    role: "Honeymoon planner",
    initials: "LM",
    color: "bg-sky-500/10 text-sky-600",
    rating: 5,
    text: "We used Traveloop to plan our honeymoon across 4 countries. The roadmap timeline view helped us visualize the whole trip at once. Absolutely stunning app.",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-sm font-medium text-primary">
            Loved by travelers
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            What our users{" "}
            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              are saying
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Thousands of travelers use Traveloop to plan smarter and travel better.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex size-10 items-center justify-center rounded-full text-sm font-bold ${t.color}`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <Quote className="size-5 text-primary/30" />
              </div>

              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <Star key={si} className="size-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">{t.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
