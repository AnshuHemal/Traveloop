import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, DollarSign } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";
import { BudgetClient } from "./_components/budget-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({ where: { id }, select: { title: true } });
  return { title: trip ? `${trip.title} — Budget | Traveloop` : "Budget — Traveloop" };
}

const GRADIENT_MAP: Record<string, string> = {
  DRAFT:     "from-muted/60 via-muted/30 to-transparent",
  PLANNED:   "from-primary/20 via-primary/10 to-transparent",
  ONGOING:   "from-emerald-500/20 via-emerald-500/10 to-transparent",
  COMPLETED: "from-violet-500/20 via-violet-500/10 to-transparent",
};

export default async function BudgetPage({ params }: PageProps) {
  const user = await requireUser();
  const { id } = await params;

  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      stops: {
        include: {
          activities: { select: { cost: true } },
          expenses:   { orderBy: { createdAt: "desc" } },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!trip) notFound();
  if (trip.userId !== user.id) notFound();

  const gradient = GRADIENT_MAP[trip.status] ?? GRADIENT_MAP.DRAFT;

  return (
    <div className="flex flex-col gap-8 pb-16">

      {/* Breadcrumb */}
      <FadeIn direction="down">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/trips" className="hover:text-foreground transition-colors">Trips</Link>
          <span>/</span>
          <Link href={`/trips/${trip.id}`} className="hover:text-foreground transition-colors truncate max-w-40">{trip.title}</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Budget</span>
        </div>
      </FadeIn>

      {/* Hero */}
      <FadeIn delay={0.05}>
        <div className={cn("relative overflow-hidden rounded-2xl bg-linear-to-br px-6 py-8 sm:px-8 sm:py-10", gradient)}>
          <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-primary/8 blur-3xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-background/80 backdrop-blur-sm shadow-sm">
                <DollarSign className="size-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Budget Tracker
                </h1>
                <p className="mt-0.5 text-sm text-muted-foreground">{trip.title}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`/trips/${trip.id}`}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-background/80 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm hover:bg-background transition-colors">
                <ChevronLeft className="size-4" /> Back to trip
              </Link>
              <Link href={`/trips/${trip.id}/itinerary`}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-background/80 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm hover:bg-background transition-colors">
                View itinerary
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Budget client */}
      <FadeIn delay={0.1}>
        <BudgetClient
          tripId={trip.id}
          currency={trip.currency}
          stops={trip.stops.map((s) => ({
            id:         s.id,
            cityName:   s.cityName,
            activities: s.activities,
            expenses:   s.expenses.map((e) => ({
              id:       e.id,
              category: e.category,
              label:    e.label,
              amount:   e.amount,
              currency: e.currency,
              date:     e.date,
              notes:    e.notes,
              stop:     { cityName: s.cityName },
            })),
          }))}
        />
      </FadeIn>

    </div>
  );
}
