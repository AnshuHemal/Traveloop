import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Plus, Map } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { FadeIn } from "@/components/motion/fade-in";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TripsToolbar } from "./_components/trips-toolbar";
import { TripGridCard } from "./_components/trip-grid-card";
import { TripListItem } from "./_components/trip-list-item";
import { TripsEmpty } from "./_components/trips-empty";

export const metadata: Metadata = {
  title: "My Trips — Traveloop",
  description: "View and manage all your travel plans.",
};

interface PageProps {
  searchParams: Promise<{
    q?:      string;
    status?: string;
    sort?:   string;
    view?:   string;
  }>;
}

export default async function TripsPage({ searchParams }: PageProps) {
  const user = await requireUser();
  const params = await searchParams;

  const q      = params.q?.trim()      ?? "";
  const status = params.status?.trim() ?? "";
  const view   = params.view           ?? "grid";

  // Build where clause
  const where = {
    userId: user.id,
    ...(status && { status: status as "DRAFT" | "PLANNED" | "ONGOING" | "COMPLETED" }),
    ...(q && {
      OR: [
        { title:       { contains: q, mode: "insensitive" as const } },
        { description: { contains: q, mode: "insensitive" as const } },
        { stops: { some: { cityName: { contains: q, mode: "insensitive" as const } } } },
      ],
    }),
  };

  // Fetch all trips for total count
  const totalCount = await prisma.trip.count({ where: { userId: user.id } });

  // Build orderBy
  const orderByMap = {
    updatedAt_desc: { updatedAt: "desc" as const },
    createdAt_desc: { createdAt: "desc" as const },
    createdAt_asc:  { createdAt: "asc"  as const },
    title_asc:      { title:     "asc"  as const },
    title_desc:     { title:     "desc" as const },
    startDate_asc:  { startDate: "asc"  as const },
    startDate_desc: { startDate: "desc" as const },
  };
  const orderBy = orderByMap[(params.sort ?? "updatedAt_desc") as keyof typeof orderByMap]
    ?? { updatedAt: "desc" as const };

  // Fetch filtered + sorted trips
  const trips = await prisma.trip.findMany({
    where,
    include: {
      _count: { select: { stops: true } },
      stops: {
        select: { cityName: true, countryName: true },
        orderBy: { order: "asc" },
        take: 5,
      },
    },
    orderBy,
  });

  const hasFilters = !!(q || status);

  // Stats for the header
  const allTrips = await prisma.trip.findMany({
    where: { userId: user.id },
    select: { status: true },
  });
  const planned   = allTrips.filter((t) => t.status === "PLANNED").length;
  const ongoing   = allTrips.filter((t) => t.status === "ONGOING").length;
  const completed = allTrips.filter((t) => t.status === "COMPLETED").length;

  return (
    <div className="flex flex-col gap-8 pb-16">

      {/* ── Page header ── */}
      <FadeIn direction="down">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary/90 to-primary/70 px-8 py-10">
          {/* Decorative blobs */}
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/4 size-40 rounded-full bg-white/8 blur-2xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <Map className="size-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  My Trips
                </h1>
                <p className="mt-0.5 text-sm text-white/70">
                  {totalCount === 0
                    ? "Start planning your first adventure"
                    : `${totalCount} trip${totalCount !== 1 ? "s" : ""} planned`}
                </p>
              </div>
            </div>

            <Link
              href="/trips/new"
              className={cn(
                buttonVariants({ size: "lg" }),
                "gap-2 bg-white text-primary hover:bg-white/90 font-semibold shadow-sm",
              )}
            >
              <Plus className="size-4" />
              Plan a trip
            </Link>
          </div>

          {/* Mini stats */}
          {totalCount > 0 && (
            <div className="relative mt-6 flex flex-wrap gap-3">
              {[
                { label: "Total",     value: totalCount, color: "bg-white/20" },
                { label: "Planned",   value: planned,    color: "bg-white/15" },
                { label: "Ongoing",   value: ongoing,    color: "bg-emerald-400/20" },
                { label: "Completed", value: completed,  color: "bg-violet-400/20" },
              ].map((s) => (
                <div
                  key={s.label}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2 backdrop-blur-sm",
                    s.color,
                  )}
                >
                  <span className="text-lg font-bold text-white">{s.value}</span>
                  <span className="text-xs text-white/70">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </FadeIn>

      {/* ── Toolbar ── */}
      <FadeIn delay={0.1}>
        <Suspense>
          <TripsToolbar totalCount={totalCount} filteredCount={trips.length} />
        </Suspense>
      </FadeIn>

      {/* ── Trip list / grid ── */}
      <FadeIn delay={0.15}>
        {trips.length === 0 ? (
          <TripsEmpty hasFilters={hasFilters} />
        ) : view === "list" ? (
          <div className="flex flex-col gap-3">
            {trips.map((trip, i) => (
              <TripListItem key={trip.id} trip={trip} index={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip, i) => (
              <TripGridCard key={trip.id} trip={trip} index={i} />
            ))}
          </div>
        )}
      </FadeIn>

    </div>
  );
}
