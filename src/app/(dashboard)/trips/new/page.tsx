import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Plane } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { CreateTripForm } from "./_components/create-trip-form";

export const metadata: Metadata = {
  title: "Plan a new trip — Traveloop",
  description: "Create a personalized multi-city travel itinerary with budget tracking.",
};

export default function NewTripPage() {
  return (
    <div className="flex flex-col gap-8 pb-16">

      {}
      <FadeIn direction="down">
        {}
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-4" />
          Back to dashboard
        </Link>

        {}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary/90 to-primary/70 px-8 py-10">
          {}
          <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-white/10 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/3 size-32 rounded-full bg-white/8 blur-2xl" />

          <div className="relative flex items-center gap-5">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <Plane className="size-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Plan a new trip
              </h1>
              <p className="mt-1 text-sm text-white/75">
                Give your adventure a name, set your dates, and start building your itinerary.
              </p>
            </div>
          </div>

          {}
          <div className="relative mt-6 flex items-center gap-2">
            {[
              { n: 1, label: "Trip details", active: true },
              { n: 2, label: "Add stops",    active: false },
              { n: 3, label: "Activities",   active: false },
              { n: 4, label: "Budget",       active: false },
            ].map((step, i) => (
              <div key={step.n} className="flex items-center gap-2">
                <div className={`flex size-6 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  step.active
                    ? "bg-white text-primary"
                    : "bg-white/20 text-white/60"
                }`}>
                  {step.n}
                </div>
                <span className={`hidden text-xs font-medium sm:block ${
                  step.active ? "text-white" : "text-white/50"
                }`}>
                  {step.label}
                </span>
                {i < 3 && (
                  <div className="mx-1 h-px w-6 bg-white/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {}
      <FadeIn delay={0.1}>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <CreateTripForm />
        </div>
      </FadeIn>

    </div>
  );
}
