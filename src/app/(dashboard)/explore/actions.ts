"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import type { CityData } from "@/lib/cities-data";

export async function addCityToTrip(
  tripId: string,
  city: CityData,
): Promise<{ error?: string; stopId?: string }> {
  const user = await requireUser();

  // Verify ownership
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { userId: true },
  });

  if (!trip) return { error: "Trip not found." };
  if (trip.userId !== user.id) return { error: "Not authorised." };

  try {
    // Get current max order
    const maxOrder = await prisma.stop.aggregate({
      where: { tripId },
      _max: { order: true },
    });
    const order = (maxOrder._max.order ?? -1) + 1;

    const stop = await prisma.stop.create({
      data: {
        tripId,
        cityName:    city.name,
        countryName: city.country,
        countryCode: city.countryCode,
        nights:      3, // sensible default
        order,
      },
    });

    revalidatePath(`/trips/${tripId}`);
    revalidatePath("/dashboard");
    return { stopId: stop.id };
  } catch {
    return { error: "Failed to add city to trip." };
  }
}
