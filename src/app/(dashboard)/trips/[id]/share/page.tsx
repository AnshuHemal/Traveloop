import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { ShareClient } from "./_components/share-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Share Trip — Traveloop" };

export default async function SharePage({ params }: PageProps) {
  const user = await requireUser();
  const { id } = await params;

  const trip = await prisma.trip.findUnique({
    where: { id },
    select: { id: true, title: true, userId: true, shareToken: true, visibility: true },
  });

  if (!trip) notFound();
  if (trip.userId !== user.id) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Share this trip</h2>
        <p className="text-sm text-muted-foreground">
          Generate a public link so anyone can view your itinerary.
        </p>
      </div>
      <div className="max-w-xl">
        <ShareClient
          tripId={trip.id}
          tripTitle={trip.title}
          shareToken={trip.shareToken}
          appUrl={siteConfig.url}
        />
      </div>
    </div>
  );
}
