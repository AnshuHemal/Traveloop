import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { EditTripForm } from "./_components/edit-trip-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({ where: { id }, select: { title: true } });
  return { title: trip ? `Edit "${trip.title}" — Traveloop` : "Edit Trip — Traveloop" };
}

export default async function EditTripPage({ params }: PageProps) {
  const user = await requireUser();
  const { id } = await params;

  const trip = await prisma.trip.findUnique({
    where: { id },
    select: {
      id:          true,
      title:       true,
      description: true,
      startDate:   true,
      endDate:     true,
      currency:    true,
      visibility:  true,
      coverImage:  true,
      status:      true,
      userId:      true,
    },
  });

  if (!trip) notFound();
  if (trip.userId !== user.id) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Edit trip details</h2>
        <p className="text-sm text-muted-foreground">
          Update the name, dates, currency, and other settings for this trip.
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <EditTripForm trip={trip} />
      </div>
    </div>
  );
}
