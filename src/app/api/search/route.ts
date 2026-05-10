import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ trips: [], stops: [], activities: [] });
  }

  const userId = session.user.id;

  const trips = await prisma.trip.findMany({
    where: {
      userId,
      OR: [
        { title:       { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    },
    select: {
      id: true, title: true, status: true,
      startDate: true, endDate: true,
      _count: { select: { stops: true } },
    },
    take: 5,
    orderBy: { updatedAt: "desc" },
  });

  const stops = await prisma.stop.findMany({
    where: {
      trip: { userId },
      OR: [
        { cityName:    { contains: q, mode: "insensitive" } },
        { countryName: { contains: q, mode: "insensitive" } },
      ],
    },
    select: {
      id: true, cityName: true, countryName: true,
      trip: { select: { id: true, title: true } },
    },
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  const activities = await prisma.activity.findMany({
    where: {
      stop: { trip: { userId } },
      name: { contains: q, mode: "insensitive" },
    },
    select: {
      id: true, name: true, category: true, cost: true,
      stop: {
        select: {
          cityName: true,
          trip: { select: { id: true, title: true } },
        },
      },
    },
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ trips, stops, activities });
}
