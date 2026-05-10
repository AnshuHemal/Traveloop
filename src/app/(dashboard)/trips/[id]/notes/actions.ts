"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

type NoteColor = "DEFAULT" | "YELLOW" | "GREEN" | "BLUE" | "PINK" | "PURPLE";

async function assertTripOwner(tripId: string, userId: string) {
  const trip = await prisma.trip.findUnique({ where: { id: tripId }, select: { userId: true } });
  if (!trip) throw new Error("Trip not found");
  if (trip.userId !== userId) throw new Error("Not authorised");
}

// ── Create note ───────────────────────────────────────────────────────────────
const NoteSchema = z.object({
  tripId:  z.string(),
  stopId:  z.string().optional(),
  title:   z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required").max(5000),
  color:   z.enum(["DEFAULT","YELLOW","GREEN","BLUE","PINK","PURPLE"]).default("DEFAULT"),
  pinned:  z.coerce.boolean().default(false),
  date:    z.string().optional(),
});

export type NoteState = {
  errors?: Partial<Record<string, string[]>>;
  message?: string;
  success?: boolean;
  noteId?: string;
};

export async function createNote(
  _prev: NoteState,
  formData: FormData,
): Promise<NoteState> {
  const user = await requireUser();

  const raw = {
    tripId:  formData.get("tripId"),
    stopId:  formData.get("stopId") || undefined,
    title:   formData.get("title"),
    content: formData.get("content"),
    color:   formData.get("color") ?? "DEFAULT",
    pinned:  formData.get("pinned") ?? "false",
    date:    formData.get("date") || undefined,
  };

  const parsed = NoteSchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const { tripId, stopId, title, content, color, pinned, date } = parsed.data;

  try {
    await assertTripOwner(tripId, user.id);
    const note = await prisma.tripNote.create({
      data: {
        tripId,
        stopId:  stopId || null,
        title:   title.trim(),
        content: content.trim(),
        color:   color as NoteColor,
        pinned,
        date:    date ? new Date(date) : null,
      },
    });
    revalidatePath(`/trips/${tripId}/notes`);
    return { success: true, noteId: note.id };
  } catch (e) {
    return { message: e instanceof Error ? e.message : "Failed to create note." };
  }
}

// ── Update note ───────────────────────────────────────────────────────────────
export async function updateNote(
  _prev: NoteState,
  formData: FormData,
): Promise<NoteState> {
  const user = await requireUser();

  const noteId = formData.get("noteId") as string;
  const tripId = formData.get("tripId") as string;

  const raw = {
    tripId,
    stopId:  formData.get("stopId") || undefined,
    title:   formData.get("title"),
    content: formData.get("content"),
    color:   formData.get("color") ?? "DEFAULT",
    pinned:  formData.get("pinned") ?? "false",
    date:    formData.get("date") || undefined,
  };

  const parsed = NoteSchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const { stopId, title, content, color, pinned, date } = parsed.data;

  try {
    await assertTripOwner(tripId, user.id);
    await prisma.tripNote.update({
      where: { id: noteId },
      data: {
        stopId:  stopId || null,
        title:   title.trim(),
        content: content.trim(),
        color:   color as NoteColor,
        pinned,
        date:    date ? new Date(date) : null,
      },
    });
    revalidatePath(`/trips/${tripId}/notes`);
    return { success: true };
  } catch (e) {
    return { message: e instanceof Error ? e.message : "Failed to update note." };
  }
}

// ── Delete note ───────────────────────────────────────────────────────────────
export async function deleteNote(
  noteId: string,
  tripId: string,
): Promise<{ error?: string }> {
  const user = await requireUser();
  try {
    await assertTripOwner(tripId, user.id);
    await prisma.tripNote.delete({ where: { id: noteId } });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to delete note." };
  }
  revalidatePath(`/trips/${tripId}/notes`);
  return {};
}

// ── Toggle pin ────────────────────────────────────────────────────────────────
export async function toggleNotePin(
  noteId: string,
  tripId: string,
  pinned: boolean,
): Promise<{ error?: string }> {
  const user = await requireUser();
  try {
    await assertTripOwner(tripId, user.id);
    await prisma.tripNote.update({ where: { id: noteId }, data: { pinned } });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update note." };
  }
  revalidatePath(`/trips/${tripId}/notes`);
  return {};
}
