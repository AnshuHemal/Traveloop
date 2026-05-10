"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function markInvoicePaid(tripId: string): Promise<{ error?: string }> {
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
      data:  { status: "COMPLETED" },
    });
  } catch {
    return { error: "Failed to update trip status." };
  }

  revalidatePath(`/trips/${tripId}/invoice`);
  revalidatePath(`/trips/${tripId}`);
  revalidatePath("/trips");
  return {};
}
