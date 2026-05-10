import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Zap, Star, DollarSign, Plus } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { FadeIn } from "@/components/motion/fade-in";
import { ACTIVITY_TEMPLATES, filterActivities } from "@/lib/activities-data";
import { ActivityFilters } from "./_components/activity-filters";
import { ActivitiesClient } from "./_components/activities-client";

export const metadata: Metadata = {
  title: "Activity Search — Traveloop",
  description: "Browse and add activities to your trip stops.",
};

interface PageProps {
  searchParams: Promise<{
    q?:        string;
    category?: string;
    duration?: string;
    costTier?: string;
    sort?:     string;
    tripId?:   string;
  }>;
}

export default async function ActivitiesPage({ searchParams }: PageProps) {
  const user = await requireUser();
  const params = await searchParams;

  const q        = params.q        ?? "";
  const category = params.category ?? "ALL";
  const duration = params.duration ?? "ALL";
  const costTier = params.costTier ?? "ALL";
  const sort     = params.sort     ?? "popular";

  // Filter activities
  const filtered = filterActivities(
    ACTIVITY_TEMPLATES, q, category, duration, costTier, sort,
  );

  // Fetch user's active trip stops for "Add to trip" functionality
  const trips = await prisma.trip.findMany({
    where: { userId: user.id, status: { not: "COMPLETED" } },
    select: {
      id: true,
      title: true,
      stops: {
        select: { id: true, cityName: true },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Flatten stops with tripId
  const stops = trips.flatMap((trip) =>
    trip.stops.map((stop) => ({
      id:       stop.id,
      cityName: stop.cityName,
      tripId:   trip.id,
    })),
  );

  // Stats
  const freeCount     = ACTIVITY_TEMPLATES.filter((a) => a.costTier === "free").length;
  const popularCount  = ACTIVITY_TEMPLATES.filter((a) => a.popular).length;
  const avgRating     = (
    ACTIVITY_TEMPLATES.reduce((acc, a) => acc + a.rating, 0) / ACTIVITY_TEMPLATES.length
  ).toFixed(1);

  return (
    <div className="flex flex-col gap-8 pb-16">

      {/* ── Hero banner ── */}
      <FadeIn direction="down">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary/90 to-primary/70 px-6 py-10 sm:px-10 sm:py-14">
          {/* Decorative blobs */}
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/4 size-48 rounded-full bg-white/8 blur-2xl" />

          {/* Floating activity pills */}
          <div className="absolute right-6 top-6 hidden flex-col gap-2 lg:flex">
            {["🏛️ Sightseeing", "🍜 Food Tours", "🧗 Adventure", "🧘 Wellness"].map((pill) => (
              <span key={pill} className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {pill}
              </span>
            ))}
          </div>

          <div className="relative max-w-2xl">
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <Zap className="size-5 text-white" />
              </div>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {ACTIVITY_TEMPLATES.length} curated activities
              </span>
            </div>

            <h1 className="mb-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Discover activities
            </h1>
            <p className="mb-6 text-sm text-white/75 leading-relaxed">
              Browse sightseeing, food tours, adventures, and more. Add them directly to your trip stops.
            </p>

            {/* Mini stats */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Star,        label: `${avgRating} avg rating`,    bg: "bg-white/15" },
                { icon: Zap,         label: `${popularCount} top picks`,  bg: "bg-white/15" },
                { icon: DollarSign,  label: `${freeCount} free options`,  bg: "bg-white/15" },
              ].map((s) => (
                <div key={s.label} className={`flex items-center gap-2 rounded-xl px-3 py-2 backdrop-blur-sm ${s.bg}`}>
                  <s.icon className="size-3.5 text-white/80" />
                  <span className="text-xs font-medium text-white">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── Context banner (if user has stops) ── */}
      {stops.length > 0 ? (
        <FadeIn delay={0.08}>
          <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-3.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="size-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                You have {stops.length} stop{stops.length !== 1 ? "s" : ""} across {trips.length} trip{trips.length !== 1 ? "s" : ""}
              </p>
              <p className="text-xs text-muted-foreground">
                Click &ldquo;Add to trip&rdquo; on any activity to add it directly to a stop
              </p>
            </div>
            <div className="hidden flex-wrap gap-1.5 sm:flex">
              {stops.slice(0, 3).map((s) => (
                <span key={s.id} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {s.cityName}
                </span>
              ))}
              {stops.length > 3 && (
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  +{stops.length - 3} more
                </span>
              )}
            </div>
          </div>
        </FadeIn>
      ) : (
        <FadeIn delay={0.08}>
          <div className="flex items-center gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/8 px-5 py-4">
            <span className="text-2xl shrink-0">✈️</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">No trip stops yet</p>
              <p className="text-xs text-muted-foreground">
                Create a trip and add stops to start adding activities to your itinerary.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Link
                href="/trips/new"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus className="size-3.5" />
                Create a trip
              </Link>
              <Link
                href="/trips"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                My trips
              </Link>
            </div>
          </div>
        </FadeIn>
      )}

      {/* ── Filters ── */}
      <FadeIn delay={0.1}>
        <Suspense>
          <ActivityFilters
            totalCount={ACTIVITY_TEMPLATES.length}
            filteredCount={filtered.length}
          />
        </Suspense>
      </FadeIn>

      {/* ── Activity grid ── */}
      <FadeIn delay={0.15}>
        <ActivitiesClient activities={filtered} stops={stops} />
      </FadeIn>

    </div>
  );
}
