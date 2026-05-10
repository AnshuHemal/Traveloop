import { prisma } from "@/lib/prisma";

/**
 * Auto-updates trip statuses based on dates:
 * - startDate is today or in the past + endDate in the future → ONGOING
 * - endDate is in the past → suggest COMPLETED (returns list for UI prompt)
 *
 * Called server-side on the dashboard page.
 */
export async function syncTripStatuses(userId: string): Promise<{
  markedOngoing: string[];
  suggestCompleted: { id: string; title: string }[];
}> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Trips that should be ONGOING (started today or earlier, not yet ended)
  const shouldBeOngoing = await prisma.trip.findMany({
    where: {
      userId,
      status: { in: ["DRAFT", "PLANNED"] },
      startDate: { lte: tomorrow },
      endDate:   { gte: today },
    },
    select: { id: true, title: true },
  });

  // Auto-update to ONGOING
  const markedOngoing: string[] = [];
  for (const trip of shouldBeOngoing) {
    await prisma.trip.update({
      where: { id: trip.id },
      data:  { status: "ONGOING" },
    });
    markedOngoing.push(trip.title);
  }

  // Trips that have ended but aren't marked COMPLETED
  const suggestCompleted = await prisma.trip.findMany({
    where: {
      userId,
      status: { in: ["DRAFT", "PLANNED", "ONGOING"] },
      endDate: { lt: today },
    },
    select: { id: true, title: true },
  });

  return { markedOngoing, suggestCompleted };
}
