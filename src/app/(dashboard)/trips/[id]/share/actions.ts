"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function generateShareLink(
  tripId: string,
): Promise<{ token?: string; error?: string }> {
  const user = await requireUser();

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { userId: true, shareToken: true },
  });

  if (!trip) return { error: "Trip not found." };
  if (trip.userId !== user.id) return { error: "Not authorised." };

  const token = trip.shareToken ?? nanoid(12);

  try {
    await prisma.trip.update({
      where: { id: tripId },
      data: { shareToken: token, visibility: "PUBLIC" },
    });
  } catch {
    return { error: "Failed to generate share link." };
  }

  revalidatePath(`/trips/${tripId}`);
  return { token };
}

export async function revokeShareLink(
  tripId: string,
): Promise<{ error?: string }> {
  const user = await requireUser();

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { userId: true },
  });

  if (!trip) return { error: "Trip not found." };
  if (trip.userId !== user.id) return { error: "Not authorised." };

  try {
    await prisma.trip.update({
      where: { id: tripId },
      data: { shareToken: null, visibility: "PRIVATE" },
    });
  } catch {
    return { error: "Failed to revoke share link." };
  }

  revalidatePath(`/trips/${tripId}`);
  return {};
}
