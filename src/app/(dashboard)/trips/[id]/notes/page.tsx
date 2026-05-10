import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { NotesClient } from "./_components/notes-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({ where: { id }, select: { title: true } });
  return { title: trip ? `${trip.title} — Notes | Traveloop` : "Notes — Traveloop" };
}

export default async function NotesPage({ params }: PageProps) {
  const user = await requireUser();
  const { id } = await params;

  const trip = await prisma.trip.findUnique({
    where: { id },
    select: {
      id: true, title: true, userId: true,
      notes: {
        include: { stop: { select: { cityName: true } } },
        orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
      },
      stops: {
        select: { id: true, cityName: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!trip) notFound();
  if (trip.userId !== user.id) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Trip Notes</h2>
        <p className="text-sm text-muted-foreground">
          Jot down hotel details, contacts, reminders, and day-specific info.
        </p>
      </div>

      <NotesClient
        tripId={trip.id}
        notes={trip.notes.map((n) => ({
          id:        n.id,
          title:     n.title,
          content:   n.content,
          color:     n.color,
          pinned:    n.pinned,
          date:      n.date,
          createdAt: n.createdAt,
          updatedAt: n.updatedAt,
          stopId:    n.stopId,
          stop:      n.stop,
        }))}
        stops={trip.stops}
      />
    </div>
  );
}
