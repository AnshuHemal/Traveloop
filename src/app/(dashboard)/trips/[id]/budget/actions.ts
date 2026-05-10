"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

async function assertTripOwner(tripId: string, userId: string) {
  const trip = await prisma.trip.findUnique({ where: { id: tripId }, select: { userId: true } });
  if (!trip) throw new Error("Trip not found");
  if (trip.userId !== userId) throw new Error("Not authorised");
}

const AddExpenseSchema = z.object({
  tripId:   z.string(),
  stopId:   z.string().optional(),
  category: z.enum(["ACCOMMODATION","FOOD","TRANSPORT","ACTIVITIES","SHOPPING","VISA","INSURANCE","MISC"]),
  label:    z.string().min(1, "Description is required").max(200),
  amount:   z.coerce.number().min(0, "Amount must be positive"),
  date:     z.string().optional(),
  notes:    z.string().max(500).optional(),
});

export type AddExpenseState = {
  errors?: Partial<Record<string, string[]>>;
  message?: string;
  success?: boolean;
};

export async function addExpense(
  _prev: AddExpenseState,
  formData: FormData,
): Promise<AddExpenseState> {
  const user = await requireUser();

  const raw = {
    tripId:   formData.get("tripId"),
    stopId:   formData.get("stopId") || undefined,
    category: formData.get("category") ?? "MISC",
    label:    formData.get("label"),
    amount:   formData.get("amount") ?? "0",
    date:     formData.get("date") || undefined,
    notes:    formData.get("notes") || undefined,
  };

  const parsed = AddExpenseSchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const { tripId, stopId, category, label, amount, date, notes } = parsed.data;

  try {
    await assertTripOwner(tripId, user.id);

    // If no stopId, attach to first stop of the trip
    let resolvedStopId = stopId;
    if (!resolvedStopId) {
      const firstStop = await prisma.stop.findFirst({
        where: { tripId },
        orderBy: { order: "asc" },
        select: { id: true },
      });
      if (!firstStop) return { message: "Add at least one stop before logging expenses." };
      resolvedStopId = firstStop.id;
    }

    await prisma.expense.create({
      data: {
        stopId:   resolvedStopId,
        category: category as "ACCOMMODATION" | "FOOD" | "TRANSPORT" | "ACTIVITIES" | "SHOPPING" | "VISA" | "INSURANCE" | "MISC",
        label:    label.trim(),
        amount,
        currency: "USD",
        date:     date ? new Date(date) : null,
        notes:    notes?.trim() || null,
      },
    });
  } catch (e) {
    return { message: e instanceof Error ? e.message : "Failed to add expense." };
  }

  revalidatePath(`/trips/${tripId}/budget`);
  revalidatePath(`/trips/${tripId}`);
  return { success: true };
}

export async function deleteExpense(
  expenseId: string,
  tripId: string,
): Promise<{ error?: string }> {
  const user = await requireUser();
  try {
    await assertTripOwner(tripId, user.id);
    await prisma.expense.delete({ where: { id: expenseId } });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to delete expense." };
  }
  revalidatePath(`/trips/${tripId}/budget`);
  return {};
}
