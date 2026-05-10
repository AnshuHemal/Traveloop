"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight, ArrowLeft, CheckCircle2,
  Plane, Mountain, Utensils, Camera,
  Briefcase, Heart, Compass, Loader2,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { completeOnboarding } from "../actions";

const TRAVELER_TYPES = [
  { id: "adventure",  label: "Adventure Seeker",  emoji: "🧗", icon: Mountain,  desc: "Hiking, extreme sports, off the beaten path" },
  { id: "culture",    label: "Culture Explorer",  emoji: "🏛️", icon: Camera,    desc: "Museums, history, local traditions" },
  { id: "foodie",     label: "Food Lover",        emoji: "🍜", icon: Utensils,  desc: "Street food, fine dining, cooking classes" },
  { id: "relaxation", label: "Beach & Relaxation",emoji: "🏖️", icon: Heart,     desc: "Beaches, spas, slow travel" },
  { id: "business",   label: "Business Traveler", emoji: "💼", icon: Briefcase, desc: "Conferences, work trips, city breaks" },
  { id: "explorer",   label: "Free Explorer",     emoji: "🗺️", icon: Compass,   desc: "No fixed plans, go wherever the wind takes you" },
];

const TRIP_TEMPLATES = [
  { id: "weekend",    label: "Weekend Getaway",   emoji: "🌆", desc: "2–3 days, 1 city",       days: 2 },
  { id: "week",       label: "Week-long Trip",    emoji: "✈️", desc: "7 days, 2–3 cities",     days: 7 },
  { id: "twoweeks",   label: "Two-week Adventure",emoji: "🌍", desc: "14 days, 4+ cities",     days: 14 },
  { id: "custom",     label: "Custom Trip",       emoji: "🗓️", desc: "I'll set my own dates",  days: 0 },
];

interface OnboardingWizardProps {
  userName: string;
}

export function OnboardingWizard({ userName }: OnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [travelerType, setTravelerType] = useState<string | null>(null);
  const [tripTemplate, setTripTemplate] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const firstName = userName.split(" ")[0] || "Traveler";

  const STEPS = [
    { title: "What kind of traveler are you?",  subtitle: "We'll personalise your experience based on your style." },
    { title: "How do you want to start?",        subtitle: "Pick a trip template or start from scratch." },
    { title: "You're all set!",                  subtitle: "Your Traveloop account is ready to go." },
  ];

  function handleNext() {
    if (step < 2) setStep((s) => s + 1);
  }

  function handleBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  function handleFinish() {
    startTransition(async () => {
      await completeOnboarding({ travelerType, tripTemplate });
      if (tripTemplate && tripTemplate !== "custom") {
        router.push("/trips/new");
      } else {
        router.push("/dashboard");
      }
    });
  }

  const canProceedStep0 = travelerType !== null;
  const canProceedStep1 = tripTemplate !== null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {}
      <div aria-hidden className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,oklch(0.92_0.06_185/0.3)_0%,transparent_70%)]" />
      <div aria-hidden className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] opacity-25" />

      <div className="relative z-10 w-full max-w-2xl">

        {}
        <div className="mb-8 flex items-center gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex-1">
              <div className="h-1.5 overflow-hidden rounded-full bg-border">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  animate={{ width: i <= step ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden rounded-2xl border border-border bg-card/90 backdrop-blur-sm shadow-xl shadow-black/5"
        >
          {}
          <div className="border-b border-border bg-linear-to-br from-primary/10 via-primary/5 to-transparent px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15">
                <Plane className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Step {step + 1} of 3
                </p>
                <h1 className="text-xl font-bold text-foreground">
                  {step === 0 ? `Welcome, ${firstName}! 👋` : STEPS[step].title}
                </h1>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {STEPS[step].subtitle}
            </p>
          </div>

          {}
          <div className="p-8">
            <AnimatePresence mode="wait">

              {}
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-2 gap-3 sm:grid-cols-3"
                >
                  {TRAVELER_TYPES.map((type, i) => (
                    <motion.button
                      key={type.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      type="button"
                      onClick={() => setTravelerType(type.id)}
                      className={cn(
                        "flex flex-col items-center gap-2.5 rounded-2xl border-2 p-4 text-center transition-all duration-200",
                        travelerType === type.id
                          ? "border-primary bg-primary/8 shadow-md shadow-primary/10"
                          : "border-border hover:border-primary/40 hover:bg-muted/50",
                      )}
                    >
                      <span className="text-3xl">{type.emoji}</span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{type.label}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground leading-tight">{type.desc}</p>
                      </div>
                      {travelerType === type.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex size-5 items-center justify-center rounded-full bg-primary"
                        >
                          <CheckCircle2 className="size-3 text-primary-foreground" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-2 gap-3"
                >
                  {TRIP_TEMPLATES.map((tmpl, i) => (
                    <motion.button
                      key={tmpl.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      type="button"
                      onClick={() => setTripTemplate(tmpl.id)}
                      className={cn(
                        "flex flex-col items-start gap-3 rounded-2xl border-2 p-5 text-left transition-all duration-200",
                        tripTemplate === tmpl.id
                          ? "border-primary bg-primary/8 shadow-md shadow-primary/10"
                          : "border-border hover:border-primary/40 hover:bg-muted/50",
                      )}
                    >
                      <span className="text-3xl">{tmpl.emoji}</span>
                      <div>
                        <p className="font-semibold text-foreground">{tmpl.label}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{tmpl.desc}</p>
                      </div>
                      {tripTemplate === tmpl.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex size-5 items-center justify-center rounded-full bg-primary"
                        >
                          <CheckCircle2 className="size-3 text-primary-foreground" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-6 py-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                    className="flex size-24 items-center justify-center rounded-full bg-primary/10"
                  >
                    <span className="text-5xl">🌍</span>
                  </motion.div>

                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      You&apos;re ready to explore!
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                      {tripTemplate && tripTemplate !== "custom"
                        ? "We'll take you straight to the trip creator to start planning."
                        : "Head to your dashboard to start building your first adventure."}
                    </p>
                  </div>

                  {}
                  <div className="flex flex-wrap justify-center gap-2">
                    {travelerType && (
                      <span className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-xs font-medium text-primary">
                        {TRAVELER_TYPES.find((t) => t.id === travelerType)?.emoji}{" "}
                        {TRAVELER_TYPES.find((t) => t.id === travelerType)?.label}
                      </span>
                    )}
                    {tripTemplate && (
                      <span className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                        {TRIP_TEMPLATES.find((t) => t.id === tripTemplate)?.emoji}{" "}
                        {TRIP_TEMPLATES.find((t) => t.id === tripTemplate)?.label}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {}
          <div className="flex items-center justify-between border-t border-border px-8 py-5">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 0}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "gap-2",
                step === 0 && "invisible",
              )}
            >
              <ArrowLeft className="size-4" />
              Back
            </button>

            <div className="flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    i === step ? "size-2.5 bg-primary" : "size-2 bg-border",
                  )}
                />
              ))}
            </div>

            {step < 2 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={step === 0 ? !canProceedStep0 : !canProceedStep1}
                className={cn(
                  buttonVariants(),
                  "gap-2",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                )}
              >
                Continue
                <ArrowRight className="size-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={isPending}
                className={cn(buttonVariants(), "gap-2 min-w-36")}
              >
                {isPending ? (
                  <><Loader2 className="size-4 animate-spin" /> Starting…</>
                ) : tripTemplate && tripTemplate !== "custom" ? (
                  <><Plane className="size-4" /> Plan my trip</>
                ) : (
                  <><Compass className="size-4" /> Go to dashboard</>
                )}
              </button>
            )}
          </div>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center"
        >
          <button
            type="button"
            onClick={() => {
              startTransition(async () => {
                await completeOnboarding({ travelerType: null, tripTemplate: null });
                router.push("/dashboard");
              });
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now →
          </button>
        </motion.div>
      </div>
    </div>
  );
}
