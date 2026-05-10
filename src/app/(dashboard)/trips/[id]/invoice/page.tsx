import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { InvoiceClient } from "./_components/invoice-client";
import { nanoid } from "nanoid";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({ where: { id }, select: { title: true } });
  return { title: trip ? `${trip.title} — Invoice | Traveloop` : "Invoice — Traveloop" };
}

export default async function InvoicePage({ params }: PageProps) {
  const user = await requireUser();
  const { id } = await params;

  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      user: { select: { name: true } },
      stops: {
        include: {
          activities: {
            select: { id: true, name: true, category: true, cost: true, date: true },
            orderBy: { order: "asc" },
          },
          expenses: {
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!trip) notFound();
  if (trip.userId !== user.id) notFound();

  const lineItems: {
    id: string;
    category: string;
    label: string;
    qty: string;
    unitCost: number;
    amount: number;
    stopName: string | null;
    date: Date | null;
    isActivity: boolean;
  }[] = [];

  for (const stop of trip.stops) {

    for (const act of stop.activities) {
      if (act.cost > 0) {
        lineItems.push({
          id:         act.id,
          category:   act.category,
          label:      act.name,
          qty:        "1",
          unitCost:   act.cost,
          amount:     act.cost,
          stopName:   stop.cityName,
          date:       act.date,
          isActivity: true,
        });
      }
    }

    for (const exp of stop.expenses) {
      lineItems.push({
        id:         exp.id,
        category:   exp.category,
        label:      exp.label,
        qty:        exp.notes ?? "1",
        unitCost:   exp.amount,
        amount:     exp.amount,
        stopName:   stop.cityName,
        date:       exp.date,
        isActivity: false,
      });
    }
  }

  const activityTotal = trip.stops.reduce(
    (acc, s) => acc + s.activities.reduce((a, act) => a + act.cost, 0), 0,
  );
  const expenseTotal = trip.stops.reduce(
    (acc, s) => acc + s.expenses.reduce((a, e) => a + e.amount, 0), 0,
  );
  const grandTotal = activityTotal + expenseTotal;

  const invoiceId = `INV-${trip.id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Expense Invoice</h2>
        <p className="text-sm text-muted-foreground">
          A complete billing summary of all activities and expenses for this trip.
        </p>
      </div>

      <InvoiceClient
        data={{
          tripId:          trip.id,
          invoiceId,
          tripTitle:       trip.title,
          tripDescription: trip.description,
          startDate:       trip.startDate,
          endDate:         trip.endDate,
          currency:        trip.currency,
          status:          trip.status,
          ownerName:       trip.user.name ?? "Traveler",
          stopCount:       trip.stops.length,
          lineItems,
          activityTotal,
          expenseTotal,
          grandTotal,
          taxRate:         5,
          discountAmount:  0,
          stops:           trip.stops.map((s) => ({ cityName: s.cityName })),
        }}
      />
    </div>
  );
}
