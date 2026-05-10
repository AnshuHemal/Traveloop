import type { Metadata } from "next";
import Link from "next/link";
import { Plus, MapPin, Calendar, TrendingUp } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { FadeIn, StaggerChildren } from "@/components/motion/fade-in";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TripCard } from "./_components/trip-card";
import { EmptyTrips } from "./_components/empty-trips";

export const metadata: Metadata = {
  title: "My Trips — Traveloop",
};

export default async function DashboardPage() {
  const user = await requireUser();

  const trips = await prisma.trip.findMany({
    where: { userId: user.id },
    include: {
      _count: { select: { stops: true } },
      stops: {
        select: { cityName: true, countryName: true },
        orderBy: { order: "asc" },
        take: 4,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const totalStops    = trips.reduce((acc, t) => acc + t._count.stops, 0);
  const completedTrips = trips.filter((t) => t.status === "COMPLETED").length;

  return (
    <div className="flex flex-col gap-8">

      {/* Page header */}
      <FadeIn direction="down" className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {user.name?.split(" ")[0] ?? "Traveler"} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            {trips.length === 0
              ? "Ready to plan your next adventure?"
              : `You have ${trips.length} trip${trips.length !== 1 ? "s" : ""} planned.`}
          </p>
        </div>
        <FadeIn delay={0.1} className="mt-3 sm:mt-0">
          <Link href="/trips/new" className={cn(buttonVariants(), "gap-2")}>
            <Plus className="size-4" />
            New trip
          </Link>
        </FadeIn>
      </FadeIn>

      {/* Stats row */}
      {trips.length > 0 && (
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: MapPin,      label: "Total trips",   value: trips.length,  color: "text-primary",       bg: "bg-primary/10" },
              { icon: Calendar,    label: "Destinations",  value: totalStops,    color: "text-violet-500",    bg: "bg-violet-500/10" },
              { icon: TrendingUp,  label: "Completed",     value: completedTrips, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`size-5 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      )}

      {/* Trips grid */}
      {trips.length === 0 ? (
        <FadeIn delay={0.15}>
          <EmptyTrips />
        </FadeIn>
      ) : (
        <div>
          <FadeIn delay={0.15} className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Your trips</h2>
            <span className="text-sm text-muted-foreground">{trips.length} total</span>
          </FadeIn>
          <StaggerChildren className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip, i) => (
              <TripCard key={trip.id} trip={trip} index={i} />
            ))}
          </StaggerChildren>
        </div>
      )}

    </div>
  );
}
