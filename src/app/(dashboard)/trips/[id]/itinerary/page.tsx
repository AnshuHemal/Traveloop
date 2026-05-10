import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ChevronLeft, MapPin, Calendar, Moon,
  DollarSign, Pencil, Share2, Globe, Lock,
} from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ViewToggle } from "./_components/view-toggle";
import { TimelineView } from "./_components/timeline-view";
import { ListView } from "./_components/list-view";
import { CalendarView } from "./_components/calendar-view";
import { BudgetSummary } from "./_components/budget-summary";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ view?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({ where: { id }, select: { title: true } });
  return { title: trip ? `${trip.title} — Itinerary | Traveloop` : "Itinerary — Traveloop" };
}

const STATUS_CONFIG = {
  DRAFT:     { label: "Draft",     color: "bg-muted text-muted-foreground",                           dot: "bg-muted-foreground/60" },
  PLANNED:   { label: "Planned",   color: "bg-primary/10 text-primary",                               dot: "bg-primary" },
  ONGOING:   { label: "Ongoing",   color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  COMPLETED: { label: "Completed", color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",    dot: "bg-violet-500" },
} as const;

const GRADIENT_MAP: Record<string, string> = {
  DRAFT:     "from-muted/60 via-muted/30 to-transparent",
  PLANNED:   "from-primary/20 via-primary/10 to-transparent",
  ONGOING:   "from-emerald-500/20 via-emerald-500/10 to-transparent",
  COMPLETED: "from-violet-500/20 via-violet-500/10 to-transparent",
};

export default async function ItineraryViewPage({ params, searchParams }: PageProps) {
  const user = await requireUser();
  const { id } = await params;
  const { view = "timeline" } = await searchParams;

  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      _count: { select: { stops: true } },
      stops: {
        include: {
          activities: { orderBy: [{ date: "asc" }, { order: "asc" }] },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!trip) notFound();
  if (trip.userId !== user.id) notFound();

  const status = STATUS_CONFIG[trip.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.DRAFT;
  const gradient = GRADIENT_MAP[trip.status] ?? GRADIENT_MAP.DRAFT;

  const totalActivities = trip.stops.reduce((acc, s) => acc + s.activities.length, 0);
  const totalNights     = trip.stops.reduce((acc, s) => acc + s.nights, 0);
  const totalBudget     = trip.stops.reduce(
    (acc, s) => acc + s.activities.reduce((a, act) => a + act.cost, 0), 0,
  );

  const dateRange = trip.startDate && trip.endDate
    ? `${format(new Date(trip.startDate), "MMM d")} – ${format(new Date(trip.endDate), "MMM d, yyyy")}`
    : trip.startDate
      ? `From ${format(new Date(trip.startDate), "MMM d, yyyy")}`
      : null;

  const currentView = (["timeline", "list", "calendar"].includes(view) ? view : "timeline") as
    "timeline" | "list" | "calendar";

  return (
    <div className="flex flex-col gap-8 pb-16">

      {/* ── Breadcrumb ── */}
      <FadeIn direction="down">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/trips" className="hover:text-foreground transition-colors">Trips</Link>
          <span>/</span>
          <Link href={`/trips/${trip.id}`} className="hover:text-foreground transition-colors truncate max-w-40">
            {trip.title}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Itinerary</span>
        </div>
      </FadeIn>

      {/* ── Hero banner ── */}
      <FadeIn delay={0.05}>
        <div className={cn(
          "relative overflow-hidden rounded-2xl bg-linear-to-br px-6 py-8 sm:px-8 sm:py-10",
          gradient,
        )}>
          {/* Decorative blobs */}
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-primary/8 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/3 size-40 rounded-full bg-primary/5 blur-2xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            {/* Left */}
            <div className="flex flex-col gap-3">
              {/* Status + visibility */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                  status.color,
                )}>
                  <span className={cn("size-1.5 rounded-full", status.dot)} />
                  {status.label}
                </span>
                <span className="flex items-center gap-1 rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                  {trip.visibility === "PUBLIC"
                    ? <><Globe className="size-3" /> Public</>
                    : <><Lock className="size-3" /> Private</>}
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {trip.title}
              </h1>

              {trip.description && (
                <p className="max-w-xl text-sm text-muted-foreground leading-relaxed">
                  {trip.description}
                </p>
              )}

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {trip._count.stops > 0 && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4 text-primary" />
                    {trip._count.stops} {trip._count.stops === 1 ? "stop" : "stops"}
                  </span>
                )}
                {totalNights > 0 && (
                  <span className="flex items-center gap-1.5">
                    🌙 {totalNights} nights
                  </span>
                )}
                {totalActivities > 0 && (
                  <span className="flex items-center gap-1.5">
                    ✨ {totalActivities} activities
                  </span>
                )}
                {dateRange && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-4 text-primary" />
                    {dateRange}
                  </span>
                )}
                {totalBudget > 0 && (
                  <span className="flex items-center gap-1.5 font-semibold text-foreground">
                    <DollarSign className="size-4 text-primary" />
                    {trip.currency} {totalBudget.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/trips/${trip.id}`}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-background/80 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm hover:bg-background transition-colors"
              >
                <Pencil className="size-3.5" />
                Edit
              </Link>
              <button className="flex items-center gap-1.5 rounded-xl border border-border bg-background/80 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm hover:bg-background transition-colors">
                <Share2 className="size-3.5" />
                Share
              </button>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── View controls ── */}
      <FadeIn delay={0.1}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Full Itinerary</h2>
            <p className="text-xs text-muted-foreground">
              {trip.stops.length === 0
                ? "No stops added yet"
                : `${trip.stops.length} ${trip.stops.length === 1 ? "city" : "cities"} · ${totalActivities} activities`}
            </p>
          </div>
          <Suspense>
            <ViewToggle current={currentView} />
          </Suspense>
        </div>
      </FadeIn>

      {/* ── Main content ── */}
      <FadeIn delay={0.15}>
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          {/* Left: view */}
          <div>
            {currentView === "timeline" && (
              <TimelineView stops={trip.stops} currency={trip.currency} />
            )}
            {currentView === "list" && (
              <ListView stops={trip.stops} currency={trip.currency} />
            )}
            {currentView === "calendar" && (
              <CalendarView
                stops={trip.stops}
                currency={trip.currency}
                tripStartDate={trip.startDate}
              />
            )}
          </div>

          {/* Right: budget sidebar */}
          <div className="flex flex-col gap-5">
            <BudgetSummary stops={trip.stops} currency={trip.currency} />

            {/* Quick nav back to builder */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">Want to make changes?</p>
              <Link
                href={`/trips/${trip.id}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
              >
                <Pencil className="size-4" />
                Open itinerary builder
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>

    </div>
  );
}
