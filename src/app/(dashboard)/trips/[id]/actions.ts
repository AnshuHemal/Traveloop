"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

async function assertTripOwner(tripId: string, userId: string) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { userId: true },
  });
  if (!trip) throw new Error("Trip not found");
  if (trip.userId !== userId) throw new Error("Not authorised");
  return trip;
}

const AddStopSchema = z.object({
  tripId:        z.string(),
  cityName:      z.string().min(1, "City name is required").max(100),
  countryName:   z.string().min(1, "Country is required").max(100),
  countryCode:   z.string().max(3).optional(),
  arrivalDate:   z.string().optional(),
  departureDate: z.string().optional(),
  nights:        z.coerce.number().int().min(0).default(1),
  notes:         z.string().max(500).optional(),
});

export type AddStopState = {
  errors?: Partial<Record<string, string[]>>;
  message?: string;
  success?: boolean;
};

export async function addStop(
  _prev: AddStopState,
  formData: FormData,
): Promise<AddStopState> {
  const user = await requireUser();

  const raw = {
    tripId:        formData.get("tripId"),
    cityName:      formData.get("cityName"),
    countryName:   formData.get("countryName"),
    countryCode:   formData.get("countryCode"),
    arrivalDate:   formData.get("arrivalDate"),
    departureDate: formData.get("departureDate"),
    nights:        formData.get("nights") ?? "1",
    notes:         formData.get("notes"),
  };

  const parsed = AddStopSchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const { tripId, cityName, countryName, countryCode, arrivalDate, departureDate, nights, notes } =
    parsed.data;

  try {
    await assertTripOwner(tripId, user.id);

    const maxOrder = await prisma.stop.aggregate({
      where: { tripId },
      _max: { order: true },
    });
    const order = (maxOrder._max.order ?? -1) + 1;

    await prisma.stop.create({
      data: {
        tripId,
        cityName:      cityName.trim(),
        countryName:   countryName.trim(),
        countryCode:   countryCode?.trim() || null,
        arrivalDate:   arrivalDate   ? new Date(arrivalDate)   : null,
        departureDate: departureDate ? new Date(departureDate) : null,
        nights,
        notes:         notes?.trim() || null,
        order,
      },
    });
  } catch (e) {
    return { message: e instanceof Error ? e.message : "Failed to add stop." };
  }

  revalidatePath(`/trips/${parsed.data.tripId}`);
  return { success: true };
}

export async function deleteStop(stopId: string, tripId: string): Promise<{ error?: string }> {
  const user = await requireUser();
  try {
    await assertTripOwner(tripId, user.id);
    await prisma.stop.delete({ where: { id: stopId } });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to delete stop." };
  }
  revalidatePath(`/trips/${tripId}`);
  return {};
}

export async function reorderStops(
  tripId: string,
  orderedIds: string[],
): Promise<{ error?: string }> {
  const user = await requireUser();
  try {
    await assertTripOwner(tripId, user.id);
    await Promise.all(
      orderedIds.map((id, index) =>
        prisma.stop.update({ where: { id }, data: { order: index } }),
      ),
    );
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to reorder stops." };
  }
  revalidatePath(`/trips/${tripId}`);
  return {};
}

export async function updateStop(
  stopId: string,
  tripId: string,
  data: {
    cityName?: string;
    countryName?: string;
    arrivalDate?: string | null;
    departureDate?: string | null;
    nights?: number;
    notes?: string | null;
  },
): Promise<{ error?: string }> {
  const user = await requireUser();
  try {
    await assertTripOwner(tripId, user.id);
    await prisma.stop.update({
      where: { id: stopId },
      data: {
        ...(data.cityName    && { cityName:    data.cityName.trim() }),
        ...(data.countryName && { countryName: data.countryName.trim() }),
        arrivalDate:   data.arrivalDate   ? new Date(data.arrivalDate)   : null,
        departureDate: data.departureDate ? new Date(data.departureDate) : null,
        ...(data.nights !== undefined && { nights: data.nights }),
        notes: data.notes?.trim() || null,
      },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update stop." };
  }
  revalidatePath(`/trips/${tripId}`);
  return {};
}

const AddActivitySchema = z.object({
  stopId:      z.string(),
  tripId:      z.string(),
  name:        z.string().min(1, "Activity name is required").max(200),
  description: z.string().max(500).optional(),
  category:    z.enum([
    "SIGHTSEEING","FOOD","TRANSPORT","ACCOMMODATION",
    "ADVENTURE","CULTURE","SHOPPING","NIGHTLIFE","WELLNESS","OTHER",
  ]).default("SIGHTSEEING"),
  date:        z.string().optional(),
  startTime:   z.string().optional(),
  endTime:     z.string().optional(),
  cost:        z.coerce.number().min(0).default(0),
  booked:      z.coerce.boolean().default(false),
});

export type AddActivityState = {
  errors?: Partial<Record<string, string[]>>;
  message?: string;
  success?: boolean;
};

export async function addActivity(
  _prev: AddActivityState,
  formData: FormData,
): Promise<AddActivityState> {
  const user = await requireUser();

  const raw = {
    stopId:      formData.get("stopId"),
    tripId:      formData.get("tripId"),
    name:        formData.get("name"),
    description: formData.get("description"),
    category:    formData.get("category") ?? "SIGHTSEEING",
    date:        formData.get("date"),
    startTime:   formData.get("startTime"),
    endTime:     formData.get("endTime"),
    cost:        formData.get("cost") ?? "0",
    booked:      formData.get("booked") ?? "false",
  };

  const parsed = AddActivitySchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const { stopId, tripId, name, description, category, date, startTime, endTime, cost, booked } =
    parsed.data;

  try {
    await assertTripOwner(tripId, user.id);

    const maxOrder = await prisma.activity.aggregate({
      where: { stopId },
      _max: { order: true },
    });
    const order = (maxOrder._max.order ?? -1) + 1;

    await prisma.activity.create({
      data: {
        stopId,
        name:        name.trim(),
        description: description?.trim() || null,
        category:    category as "SIGHTSEEING" | "FOOD" | "TRANSPORT" | "ACCOMMODATION" | "ADVENTURE" | "CULTURE" | "SHOPPING" | "NIGHTLIFE" | "WELLNESS" | "OTHER",
        date:        date ? new Date(date) : null,
        startTime:   startTime || null,
        endTime:     endTime   || null,
        cost,
        currency:    "USD",
        booked,
        order,
      },
    });
  } catch (e) {
    return { message: e instanceof Error ? e.message : "Failed to add activity." };
  }

  revalidatePath(`/trips/${tripId}`);
  return { success: true };
}

export async function deleteActivity(
  activityId: string,
  tripId: string,
): Promise<{ error?: string }> {
  const user = await requireUser();
  try {
    await assertTripOwner(tripId, user.id);
    await prisma.activity.delete({ where: { id: activityId } });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to delete activity." };
  }
  revalidatePath(`/trips/${tripId}`);
  return {};
}

export async function toggleActivityBooked(
  activityId: string,
  tripId: string,
  booked: boolean,
): Promise<{ error?: string }> {
  const user = await requireUser();
  try {
    await assertTripOwner(tripId, user.id);
    await prisma.activity.update({ where: { id: activityId }, data: { booked } });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update activity." };
  }
  revalidatePath(`/trips/${tripId}`);
  return {};
}

export async function updateTripStatus(
  tripId: string,
  status: "DRAFT" | "PLANNED" | "ONGOING" | "COMPLETED",
): Promise<{ error?: string }> {
  const user = await requireUser();
  try {
    await assertTripOwner(tripId, user.id);
    await prisma.trip.update({ where: { id: tripId }, data: { status } });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update status." };
  }
  revalidatePath(`/trips/${tripId}`);
  return {};
}

const UpdateTripSchema = z.object({
  tripId:      z.string(),
  title:       z.string().min(1, "Trip name is required").max(100),
  description: z.string().max(500).optional(),
  startDate:   z.string().optional(),
  endDate:     z.string().optional(),
  currency:    z.string().default("USD"),
  visibility:  z.enum(["PRIVATE", "PUBLIC"]).default("PRIVATE"),
  coverImage:  z.string().optional(),
});

export type UpdateTripState = {
  errors?: Partial<Record<keyof z.infer<typeof UpdateTripSchema>, string[]>>;
  message?: string;
  success?: boolean;
};

export async function updateTrip(
  _prev: UpdateTripState,
  formData: FormData,
): Promise<UpdateTripState> {
  const user = await requireUser();

  const raw = {
    tripId:      formData.get("tripId"),
    title:       formData.get("title"),
    description: formData.get("description"),
    startDate:   formData.get("startDate"),
    endDate:     formData.get("endDate"),
    currency:    formData.get("currency") ?? "USD",
    visibility:  formData.get("visibility") ?? "PRIVATE",
    coverImage:  formData.get("coverImage"),
  };

  const parsed = UpdateTripSchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const { tripId, title, description, startDate, endDate, currency, visibility, coverImage } =
    parsed.data;

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return { errors: { endDate: ["End date must be after start date"] } };
  }

  try {
    await assertTripOwner(tripId, user.id);
    await prisma.trip.update({
      where: { id: tripId },
      data: {
        title:       title.trim(),
        description: description?.trim() || null,
        startDate:   startDate ? new Date(startDate) : null,
        endDate:     endDate   ? new Date(endDate)   : null,
        currency,
        visibility:  visibility as "PRIVATE" | "PUBLIC",
        coverImage:  coverImage || null,
      },
    });
  } catch (e) {
    return { message: e instanceof Error ? e.message : "Failed to update trip." };
  }

  revalidatePath(`/trips/${tripId}`);
  revalidatePath(`/trips/${tripId}/edit`);
  revalidatePath("/trips");
  revalidatePath("/dashboard");
  return { success: true };
}

const UpdateActivitySchema = z.object({
  activityId:  z.string(),
  tripId:      z.string(),
  name:        z.string().min(1, "Activity name is required").max(200),
  description: z.string().max(500).optional(),
  category:    z.enum([
    "SIGHTSEEING","FOOD","TRANSPORT","ACCOMMODATION",
    "ADVENTURE","CULTURE","SHOPPING","NIGHTLIFE","WELLNESS","OTHER",
  ]).default("SIGHTSEEING"),
  date:        z.string().optional(),
  startTime:   z.string().optional(),
  endTime:     z.string().optional(),
  cost:        z.coerce.number().min(0).default(0),
  booked:      z.coerce.boolean().default(false),
});

export type UpdateActivityState = {
  errors?: Partial<Record<string, string[]>>;
  message?: string;
  success?: boolean;
};

export async function updateActivity(
  _prev: UpdateActivityState,
  formData: FormData,
): Promise<UpdateActivityState> {
  const user = await requireUser();

  const raw = {
    activityId:  formData.get("activityId"),
    tripId:      formData.get("tripId"),
    name:        formData.get("name"),
    description: formData.get("description"),
    category:    formData.get("category") ?? "SIGHTSEEING",
    date:        formData.get("date"),
    startTime:   formData.get("startTime"),
    endTime:     formData.get("endTime"),
    cost:        formData.get("cost") ?? "0",
    booked:      formData.get("booked") ?? "false",
  };

  const parsed = UpdateActivitySchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const { activityId, tripId, name, description, category, date, startTime, endTime, cost, booked } =
    parsed.data;

  try {
    await assertTripOwner(tripId, user.id);
    await prisma.activity.update({
      where: { id: activityId },
      data: {
        name:        name.trim(),
        description: description?.trim() || null,
        category:    category as "SIGHTSEEING" | "FOOD" | "TRANSPORT" | "ACCOMMODATION" | "ADVENTURE" | "CULTURE" | "SHOPPING" | "NIGHTLIFE" | "WELLNESS" | "OTHER",
        date:        date ? new Date(date) : null,
        startTime:   startTime || null,
        endTime:     endTime   || null,
        cost,
        booked,
      },
    });
  } catch (e) {
    return { message: e instanceof Error ? e.message : "Failed to update activity." };
  }

  revalidatePath(`/trips/${tripId}`);
  return { success: true };
}
