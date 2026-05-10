import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin, Calendar, DollarSign, Globe,
  Moon, Clock, CheckCircle2, Circle, Star,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Logo } from "@/components/shared/logo";
import { FadeIn, StaggerChildren } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { siteConfig } from "@/config/site";

interface PageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const trip = await prisma.trip.findUnique({
    where: { shareToken: token },
    select: { title: true, description: true },
  });
  if (!trip) return { title: "Trip not found" };
  return {
    title: `${trip.title} — Traveloop`,
    description: trip.description ?? `View this trip itinerary on ${siteConfig.name}`,
  };
}

const DESTINATION_EMOJIS: Record<string, string> = {
  France: "🗼", Italy: "🏛️", Spain: "🎨", Portugal: "🌊",
  Japan: "🗾", Thailand: "🏯", Greece: "🏝️", Germany: "🏰",
  USA: "🗽", UK: "🎡", Australia: "🦘", India: "🕌",
  Indonesia: "🌴", UAE: "🏙️", Mexico: "🌮", Brazil: "🌿",
};

const CATEGORY_EMOJI: Record<string, string> = {
  SIGHTSEEING: "🏛️", FOOD: "🍜", TRANSPORT: "✈️", ACCOMMODATION: "🏨",
  ADVENTURE: "🧗", CULTURE: "🎭", SHOPPING: "🛍️", NIGHTLIFE: "🌃",
  WELLNESS: "🧘", OTHER: "📌",
};

const STOP_COLORS = [
  "bg-primary", "bg-violet-500", "bg-emerald-500",
  "bg-amber-500", "bg-rose-500", "bg-sky-500",
];

export default async function SharedTripPage({ params }: PageProps) {
  const { token } = await params;

  const trip = await prisma.trip.findUnique({
    where: { shareToken: token, visibility: "PUBLIC" },
    include: {
      user: { select: { name: true, image: true } },
      stops: {
        include: {
          activities: { orderBy: [{ date: "asc" }, { order: "asc" }] },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!trip) notFound();

  const totalActivities = trip.stops.reduce((acc, s) => acc + s.activities.length, 0);
  const totalNights     = trip.stops.reduce((acc, s) => acc + s.nights, 0);
  const totalBudget     = trip.stops.reduce(
    (acc, s) => acc + s.activities.reduce((a, act) => a + act.cost, 0), 0,
  );

  const dateRange = trip.startDate && trip.endDate
    ? `${format(new Date(trip.startDate), "MMM d")} – ${format(new Date(trip.endDate), "MMM d, yyyy")}`
    : null;

  return (
    <div className="min-h-screen bg-muted/20">
      {}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Logo size={24} />
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Globe className="size-3" /> Public trip
            </span>
            <Link
              href="/signup"
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Plan your own →
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 pb-16">

        {}
        <FadeIn direction="down" className="mb-8">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="bg-linear-to-br from-primary/20 via-primary/10 to-transparent px-6 py-8 sm:px-8">
              <div className="flex flex-col gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {trip.title}
                </h1>
                {trip.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                    {trip.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  {trip.stops.length > 0 && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-4 text-primary" />
                      {trip.stops.length} {trip.stops.length === 1 ? "stop" : "stops"}
                    </span>
                  )}
                  {totalNights > 0 && (
                    <span className="flex items-center gap-1.5">🌙 {totalNights} nights</span>
                  )}
                  {totalActivities > 0 && (
                    <span className="flex items-center gap-1.5">✨ {totalActivities} activities</span>
                  )}
                  {dateRange && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-4 text-primary" /> {dateRange}
                    </span>
                  )}
                  {totalBudget > 0 && (
                    <span className="flex items-center gap-1.5 font-semibold text-foreground">
                      <DollarSign className="size-4 text-primary" />
                      {trip.currency} {totalBudget.toLocaleString()} estimated
                    </span>
                  )}
                </div>
                {trip.user.name && (
                  <p className="text-xs text-muted-foreground">
                    Planned by <span className="font-semibold text-foreground">{trip.user.name}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </FadeIn>

        {}
        <StaggerChildren className="flex flex-col gap-0">
          {trip.stops.map((stop, stopIdx) => {
            const emoji = DESTINATION_EMOJIS[stop.countryName] ?? "📍";
            const dotColor = STOP_COLORS[stopIdx % STOP_COLORS.length];
            const isLast = stopIdx === trip.stops.length - 1;
            const stopCost = stop.activities.reduce((acc, a) => acc + a.cost, 0);

            const dateRange = stop.arrivalDate && stop.departureDate
              ? `${format(new Date(stop.arrivalDate), "MMM d")} – ${format(new Date(stop.departureDate), "MMM d, yyyy")}`
              : stop.arrivalDate ? format(new Date(stop.arrivalDate), "MMM d, yyyy") : null;

            return (
              <div key={stop.id} className="flex gap-5">
                {}
                <div className="flex flex-col items-center">
                  <FadeIn>
                    <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-full border-4 border-background text-lg shadow-md", dotColor)}>
                      {emoji}
                    </div>
                  </FadeIn>
                  {!isLast && <div className={cn("w-0.5 flex-1 my-2 rounded-full min-h-8 opacity-30", dotColor)} />}
                </div>

                {}
                <FadeIn className={cn("flex-1 pb-8", isLast && "pb-0")}>
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{stop.cityName}</h2>
                      <p className="text-sm text-muted-foreground">{stop.countryName}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {dateRange && (
                        <span className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 px-2.5 py-1">
                          <Calendar className="size-3 text-primary" /> {dateRange}
                        </span>
                      )}
                      <span className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 px-2.5 py-1">
                        <Moon className="size-3 text-primary" /> {stop.nights}n
                      </span>
                      {stopCost > 0 && (
                        <span className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 px-2.5 py-1 font-medium text-foreground">
                          <DollarSign className="size-3 text-primary" /> {trip.currency} {stopCost.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {stop.notes && (
                    <div className="mb-4 rounded-xl bg-muted/30 px-4 py-3">
                      <p className="text-xs text-muted-foreground">📝 {stop.notes}</p>
                    </div>
                  )}

                  {stop.activities.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {stop.activities.map((act) => (
                        <div key={act.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3">
                          <span className="text-lg shrink-0">{CATEGORY_EMOJI[act.category] ?? "📌"}</span>
                          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <p className="text-sm font-semibold text-foreground">{act.name}</p>
                            {act.description && <p className="text-xs text-muted-foreground line-clamp-1">{act.description}</p>}
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                              {act.startTime && (
                                <span className="flex items-center gap-1"><Clock className="size-3 text-primary" />{act.startTime}{act.endTime && ` – ${act.endTime}`}</span>
                              )}
                              {act.cost > 0 && (
                                <span className="flex items-center gap-1 font-medium text-foreground"><DollarSign className="size-3 text-primary" />{act.cost}</span>
                              )}
                            </div>
                          </div>
                          {act.booked ? (
                            <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                          ) : (
                            <Circle className="size-4 shrink-0 text-muted-foreground/40" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </FadeIn>
              </div>
            );
          })}
        </StaggerChildren>

        {}
        <FadeIn delay={0.3} className="mt-12">
          <div className="rounded-2xl bg-linear-to-br from-primary via-primary/90 to-primary/70 px-6 py-8 text-center">
            <p className="mb-2 text-lg font-bold text-white">Plan your own adventure</p>
            <p className="mb-5 text-sm text-white/75">Create personalized itineraries, track budgets, and share with friends.</p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-primary hover:bg-white/90 transition-colors"
            >
              Get started free →
            </Link>
          </div>
        </FadeIn>
      </main>
    </div>
  );
}
