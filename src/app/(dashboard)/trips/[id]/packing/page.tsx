import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PackingClient } from "./_components/packing-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({ where: { id }, select: { title: true } });
  return { title: trip ? `${trip.title} — Packing | Traveloop` : "Packing — Traveloop" };
}

export default async function PackingPage({ params }: PageProps) {
  const user = await requireUser();
  const { id } = await params;

  const trip = await prisma.trip.findUnique({
    where: { id },
    select: {
      id: true, title: true, userId: true,
      packingList: {
        include: {
          items: { orderBy: [{ category: "asc" }, { order: "asc" }] },
        },
      },
    },
  });

  if (!trip) notFound();
  if (trip.userId !== user.id) notFound();

  const items = trip.packingList?.items ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Packing Checklist</h2>
        <p className="text-sm text-muted-foreground">
          Track everything you need to pack for this trip.
        </p>
      </div>

      <PackingClient
        tripId={trip.id}
        tripTitle={trip.title}
        items={items.map((i) => ({
          id:        i.id,
          name:      i.name,
          category:  i.category,
          packed:    i.packed,
          essential: i.essential,
          quantity:  i.quantity,
          notes:     i.notes,
        }))}
      />
    </div>
  );
}
