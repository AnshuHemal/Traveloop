"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import type { ActivityTemplate } from "@/lib/activities-data";

export async function addActivityToStop(
  stopId: string,
  tripId: string,
  activity: ActivityTemplate,
): Promise<{ error?: string }> {
  const user = await requireUser();

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { userId: true },
  });

  if (!trip) return { error: "Trip not found." };
  if (trip.userId !== user.id) return { error: "Not authorised." };

  try {
    const maxOrder = await prisma.activity.aggregate({
      where: { stopId },
      _max: { order: true },
    });
    const order = (maxOrder._max.order ?? -1) + 1;

    await prisma.activity.create({
      data: {
        stopId,
        name:        activity.name,
        description: activity.description,
        category:    activity.category,
        cost:        activity.avgCost,
        currency:    "USD",
        booked:      false,
        order,
      },
    });

    revalidatePath(`/trips/${tripId}`);
    return {};
  } catch {
    return { error: "Failed to add activity." };
  }
}
