import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { BudgetClient } from "./_components/budget-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({ where: { id }, select: { title: true } });
  return { title: trip ? `${trip.title} — Budget | Traveloop` : "Budget — Traveloop" };
}

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

  return (
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
  );
}
