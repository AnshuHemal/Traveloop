"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

type PackingCategory =
  | "DOCUMENTS" | "CLOTHING" | "ELECTRONICS" | "TOILETRIES"
  | "HEALTH" | "MONEY" | "ENTERTAINMENT" | "FOOD_SNACKS" | "OTHER";

// ── helpers ───────────────────────────────────────────────────────────────────
async function assertTripOwner(tripId: string, userId: string) {
  const trip = await prisma.trip.findUnique({ where: { id: tripId }, select: { userId: true } });
  if (!trip) throw new Error("Trip not found");
  if (trip.userId !== userId) throw new Error("Not authorised");
}

async function getOrCreateList(tripId: string) {
  const existing = await prisma.packingList.findUnique({ where: { tripId } });
  if (existing) return existing;
  return prisma.packingList.create({ data: { tripId } });
}

// ── Add item ──────────────────────────────────────────────────────────────────
const AddItemSchema = z.object({
  tripId:    z.string(),
  name:      z.string().min(1, "Item name is required").max(100),
  category:  z.enum(["DOCUMENTS","CLOTHING","ELECTRONICS","TOILETRIES","HEALTH","MONEY","ENTERTAINMENT","FOOD_SNACKS","OTHER"]).default("OTHER"),
  essential: z.coerce.boolean().default(false),
  quantity:  z.coerce.number().int().min(1).max(99).default(1),
  notes:     z.string().max(200).optional(),
});

export type AddItemState = {
  errors?: Partial<Record<string, string[]>>;
  message?: string;
  success?: boolean;
};

export async function addPackingItem(
  _prev: AddItemState,
  formData: FormData,
): Promise<AddItemState> {
  const user = await requireUser();

  const raw = {
    tripId:    formData.get("tripId"),
    name:      formData.get("name"),
    category:  formData.get("category") ?? "OTHER",
    essential: formData.get("essential") ?? "false",
    quantity:  formData.get("quantity") ?? "1",
    notes:     formData.get("notes") || undefined,
  };

  const parsed = AddItemSchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const { tripId, name, category, essential, quantity, notes } = parsed.data;

  try {
    await assertTripOwner(tripId, user.id);
    const list = await getOrCreateList(tripId);

    const maxOrder = await prisma.packingItem.aggregate({
      where: { packingListId: list.id },
      _max: { order: true },
    });
    const order = (maxOrder._max.order ?? -1) + 1;

    await prisma.packingItem.create({
      data: {
        packingListId: list.id,
        name:          name.trim(),
        category:      category as PackingCategory,
        essential,
        quantity,
        notes:         notes?.trim() || null,
        order,
      },
    });
  } catch (e) {
    return { message: e instanceof Error ? e.message : "Failed to add item." };
  }

  revalidatePath(`/trips/${tripId}/packing`);
  return { success: true };
}

// ── Toggle packed ─────────────────────────────────────────────────────────────
export async function toggleItemPacked(
  itemId: string,
  tripId: string,
  packed: boolean,
): Promise<{ error?: string }> {
  const user = await requireUser();
  try {
    await assertTripOwner(tripId, user.id);
    await prisma.packingItem.update({ where: { id: itemId }, data: { packed } });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update item." };
  }
  revalidatePath(`/trips/${tripId}/packing`);
  return {};
}

// ── Delete item ───────────────────────────────────────────────────────────────
export async function deletePackingItem(
  itemId: string,
  tripId: string,
): Promise<{ error?: string }> {
  const user = await requireUser();
  try {
    await assertTripOwner(tripId, user.id);
    await prisma.packingItem.delete({ where: { id: itemId } });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to delete item." };
  }
  revalidatePath(`/trips/${tripId}/packing`);
  return {};
}

// ── Reset all (unpack everything) ─────────────────────────────────────────────
export async function resetPackingList(tripId: string): Promise<{ error?: string }> {
  const user = await requireUser();
  try {
    await assertTripOwner(tripId, user.id);
    const list = await prisma.packingList.findUnique({ where: { tripId } });
    if (!list) return {};
    await prisma.packingItem.updateMany({
      where: { packingListId: list.id },
      data:  { packed: false },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to reset checklist." };
  }
  revalidatePath(`/trips/${tripId}/packing`);
  return {};
}

// ── Clear all items ───────────────────────────────────────────────────────────
export async function clearPackingList(tripId: string): Promise<{ error?: string }> {
  const user = await requireUser();
  try {
    await assertTripOwner(tripId, user.id);
    const list = await prisma.packingList.findUnique({ where: { tripId } });
    if (!list) return {};
    await prisma.packingItem.deleteMany({ where: { packingListId: list.id } });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to clear checklist." };
  }
  revalidatePath(`/trips/${tripId}/packing`);
  return {};
}

// ── Seed with defaults ────────────────────────────────────────────────────────
const DEFAULT_ITEMS: { name: string; category: PackingCategory; essential: boolean }[] = [
  // Documents
  { name: "Passport",                    category: "DOCUMENTS",    essential: true },
  { name: "Flight tickets (printed)",    category: "DOCUMENTS",    essential: true },
  { name: "Travel insurance",            category: "DOCUMENTS",    essential: true },
  { name: "Hotel booking confirmation",  category: "DOCUMENTS",    essential: false },
  { name: "Visa documents",              category: "DOCUMENTS",    essential: false },
  // Clothing
  { name: "Casual shirts",               category: "CLOTHING",     essential: true },
  { name: "Trousers / jeans",            category: "CLOTHING",     essential: true },
  { name: "Comfortable walking shoes",   category: "CLOTHING",     essential: true },
  { name: "Light jacket / windbreaker",  category: "CLOTHING",     essential: false },
  { name: "Underwear & socks",           category: "CLOTHING",     essential: true },
  // Electronics
  { name: "Phone charger",               category: "ELECTRONICS",  essential: true },
  { name: "Universal power adapter",     category: "ELECTRONICS",  essential: true },
  { name: "Earphones / headphones",      category: "ELECTRONICS",  essential: false },
  { name: "Camera",                      category: "ELECTRONICS",  essential: false },
  // Toiletries
  { name: "Toothbrush & toothpaste",     category: "TOILETRIES",   essential: true },
  { name: "Shampoo & conditioner",       category: "TOILETRIES",   essential: true },
  { name: "Sunscreen",                   category: "TOILETRIES",   essential: false },
  { name: "Deodorant",                   category: "TOILETRIES",   essential: true },
  // Health
  { name: "Prescription medications",    category: "HEALTH",       essential: true },
  { name: "Pain relievers",              category: "HEALTH",       essential: false },
  { name: "Hand sanitizer",              category: "HEALTH",       essential: false },
  // Money
  { name: "Credit / debit cards",        category: "MONEY",        essential: true },
  { name: "Local currency (cash)",       category: "MONEY",        essential: true },
];

export async function seedDefaultItems(tripId: string): Promise<{ error?: string }> {
  const user = await requireUser();
  try {
    await assertTripOwner(tripId, user.id);
    const list = await getOrCreateList(tripId);

    // Only seed if list is empty
    const count = await prisma.packingItem.count({ where: { packingListId: list.id } });
    if (count > 0) return {};

    await prisma.packingItem.createMany({
      data: DEFAULT_ITEMS.map((item, i) => ({
        packingListId: list.id,
        name:          item.name,
        category:      item.category,
        essential:     item.essential,
        quantity:      1,
        order:         i,
      })),
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to seed items." };
  }
  revalidatePath(`/trips/${tripId}/packing`);
  return {};
}
