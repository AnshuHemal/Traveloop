"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CreateTripSchema = z.object({
  title:       z.string().min(1, "Trip name is required").max(100),
  description: z.string().max(500).optional(),
  startDate:   z.string().optional(),
  endDate:     z.string().optional(),
  currency:    z.string().default("USD"),
  visibility:  z.enum(["PRIVATE", "PUBLIC"]).default("PRIVATE"),
  coverImage:  z.string().optional(),
});

export type CreateTripState = {
  errors?: Partial<Record<keyof z.infer<typeof CreateTripSchema>, string[]>>;
  message?: string;
};

export async function createTrip(
  _prev: CreateTripState,
  formData: FormData,
): Promise<CreateTripState> {
  const user = await requireUser();

  const raw = {
    title:       formData.get("title"),
    description: formData.get("description"),
    startDate:   formData.get("startDate"),
    endDate:     formData.get("endDate"),
    currency:    formData.get("currency") ?? "USD",
    visibility:  formData.get("visibility") ?? "PRIVATE",
    coverImage:  formData.get("coverImage"),
  };

  const parsed = CreateTripSchema.safeParse(raw);

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { title, description, startDate, endDate, currency, visibility, coverImage } =
    parsed.data;

  // Validate date range
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return {
      errors: { endDate: ["End date must be after start date"] },
    };
  }

  let trip;
  try {
    trip = await prisma.trip.create({
      data: {
        userId:      user.id,
        title:       title.trim(),
        description: description?.trim() || null,
        startDate:   startDate ? new Date(startDate) : null,
        endDate:     endDate   ? new Date(endDate)   : null,
        currency:    currency as string,
        visibility:  visibility as "PRIVATE" | "PUBLIC",
        coverImage:  coverImage || null,
        status:      "DRAFT",
      },
    });
  } catch {
    return { message: "Failed to create trip. Please try again." };
  }

  redirect(`/trips/${trip.id}`);
}
