"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

// ── Delete a trip ─────────────────────────────────────────────────────────────
export async function deleteTrip(tripId: string): Promise<{ error?: string }> {
  const user = await requireUser();

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { userId: true },
  });

  if (!trip) return { error: "Trip not found." };
  if (trip.userId !== user.id) return { error: "Not authorised." };

  try {
    await prisma.trip.delete({ where: { id: tripId } });
  } catch {
    return { error: "Failed to delete trip. Please try again." };
  }

  revalidatePath("/trips");
  revalidatePath("/dashboard");
  return {};
}

// ── Duplicate a trip ──────────────────────────────────────────────────────────
export async function duplicateTrip(tripId: string): Promise<{ error?: string; id?: string }> {
  const user = await requireUser();

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: {
      userId: true, title: true, description: true,
      currency: true, visibility: true, coverImage: true,
    },
  });

  if (!trip) return { error: "Trip not found." };
  if (trip.userId !== user.id) return { error: "Not authorised." };

  try {
    const copy = await prisma.trip.create({
      data: {
        userId:      user.id,
        title:       `${trip.title} (copy)`,
        description: trip.description,
        currency:    trip.currency,
        visibility:  trip.visibility,
        coverImage:  trip.coverImage,
        status:      "DRAFT",
      },
    });
    revalidatePath("/trips");
    revalidatePath("/dashboard");
    return { id: copy.id };
  } catch {
    return { error: "Failed to duplicate trip." };
  }
}

// ── Update trip status ────────────────────────────────────────────────────────
export async function updateTripStatus(
  tripId: string,
  status: "DRAFT" | "PLANNED" | "ONGOING" | "COMPLETED",
): Promise<{ error?: string }> {
  const user = await requireUser();

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { userId: true },
  });

  if (!trip) return { error: "Trip not found." };
  if (trip.userId !== user.id) return { error: "Not authorised." };

  try {
    await prisma.trip.update({ where: { id: tripId }, data: { status } });
  } catch {
    return { error: "Failed to update status." };
  }

  revalidatePath("/trips");
  revalidatePath("/dashboard");
  return {};
}

// ── Toggle visibility ─────────────────────────────────────────────────────────
export async function toggleTripVisibility(
  tripId: string,
  visibility: "PRIVATE" | "PUBLIC",
): Promise<{ error?: string }> {
  const user = await requireUser();

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { userId: true },
  });

  if (!trip) return { error: "Trip not found." };
  if (trip.userId !== user.id) return { error: "Not authorised." };

  try {
    await prisma.trip.update({ where: { id: tripId }, data: { visibility } });
  } catch {
    return { error: "Failed to update visibility." };
  }

  revalidatePath("/trips");
  return {};
}
