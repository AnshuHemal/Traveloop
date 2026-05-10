import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Share2 } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { FadeIn } from "@/components/motion/fade-in";
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
    <div className="flex flex-col gap-8 pb-16">
      <FadeIn direction="down">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/trips" className="hover:text-foreground transition-colors">Trips</Link>
          <span>/</span>
          <Link href={`/trips/${trip.id}`} className="hover:text-foreground transition-colors truncate max-w-40">{trip.title}</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Share</span>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary/90 to-primary/70 px-6 py-8 sm:px-8 sm:py-10">
          <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <Share2 className="size-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Share your trip</h1>
              <p className="mt-0.5 text-sm text-white/75">{trip.title}</p>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="mx-auto w-full max-w-xl">
          <ShareClient
            tripId={trip.id}
            tripTitle={trip.title}
            shareToken={trip.shareToken}
            appUrl={siteConfig.url}
          />
        </div>
      </FadeIn>
    </div>
  );
}
