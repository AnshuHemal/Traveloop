import { prisma } from "@/lib/prisma";

export async function syncTripStatuses(userId: string): Promise<{
  markedOngoing: string[];
  suggestCompleted: { id: string; title: string }[];
}> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const shouldBeOngoing = await prisma.trip.findMany({
    where: {
      userId,
      status: { in: ["DRAFT", "PLANNED"] },
      startDate: { lte: tomorrow },
      endDate:   { gte: today },
    },
    select: { id: true, title: true },
  });

  const markedOngoing: string[] = [];
  for (const trip of shouldBeOngoing) {
    await prisma.trip.update({
      where: { id: trip.id },
      data:  { status: "ONGOING" },
    });
    markedOngoing.push(trip.title);
  }

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
