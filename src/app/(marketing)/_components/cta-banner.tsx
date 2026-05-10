"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CTABanner() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center shadow-2xl shadow-primary/25"
        >
          {/* Background pattern */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[3rem_3rem]"
          />
          <div aria-hidden className="pointer-events-none absolute left-1/4 top-0 h-64 w-64 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute right-1/4 bottom-0 h-48 w-48 translate-y-1/2 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <div className="mb-4 text-5xl">🌍</div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Your next adventure starts here
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-white/80">
              Join thousands of travelers who plan smarter with Traveloop. Free forever for personal trips.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "gap-2 min-w-48 h-12 text-base font-semibold bg-white text-primary hover:bg-white/90"
                )}
              >
                Start planning free
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/login"
                className={cn(
                  "inline-flex h-12 min-w-36 items-center justify-center rounded-md px-6 text-base font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                )}
              >
                Sign in
              </Link>
            </div>
            <p className="mt-4 text-sm text-white/60">
              No credit card · No setup fees · Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
