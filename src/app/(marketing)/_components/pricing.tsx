"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle2, ArrowRight, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for solo travelers planning personal trips.",
    highlight: false,
    cta: "Get started free",
    href: "/signup",
    features: [
      "Unlimited trips",
      "Multi-city itineraries",
      "Budget tracker",
      "Packing checklist",
      "Trip notes & journal",
      "Public share links",
      "City & activity explorer",
      "Expense invoice",
    ],
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "For frequent travelers who want the full experience.",
    highlight: true,
    cta: "Start free trial",
    href: "/signup",
    badge: "Most popular",
    features: [
      "Everything in Free",
      "Unlimited collaborators",
      "PDF export",
      "Priority support",
      "Advanced analytics",
      "Custom invoice branding",
      "Offline access",
      "Early access to new features",
    ],
  },
  {
    name: "Team",
    price: "$29",
    period: "per month",
    description: "For travel agencies and group trip organizers.",
    highlight: false,
    cta: "Contact us",
    href: "/signup",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Shared workspace",
      "Admin controls",
      "Bulk trip management",
      "API access",
      "Dedicated support",
      "Custom integrations",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="px-6 py-24 bg-muted/30">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-sm font-medium text-primary">
            Simple pricing
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Start free,{" "}
            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              upgrade when ready
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            No credit card required. The free plan covers everything most travelers need.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={cn(
                "relative flex flex-col rounded-2xl border p-7 transition-all",
                plan.highlight
                  ? "border-primary bg-primary/5 shadow-xl shadow-primary/10 scale-[1.02]"
                  : "border-border bg-card hover:border-primary/30 hover:shadow-lg",
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                    <Zap className="size-3" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="mb-8 flex flex-col gap-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-foreground">
                    <CheckCircle2 className="size-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={cn(
                  plan.highlight
                    ? cn(buttonVariants({ size: "lg" }), "w-full gap-2 font-semibold")
                    : cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full gap-2"),
                )}
              >
                {plan.cta}
                <ArrowRight className="size-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
