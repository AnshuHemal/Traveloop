"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { requireUser } from "@/lib/session";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// ── Update profile name ───────────────────────────────────────────────────────
const UpdateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

export type UpdateProfileState = {
  errors?: { name?: string[] };
  message?: string;
  success?: boolean;
};

export async function updateProfile(
  _prev: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  const user = await requireUser();

  const parsed = UpdateProfileSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const { name } = parsed.data;

  try {
    await prisma.user.update({
      where: { id: user.id },
      data:  { name: name.trim() },
    });
  } catch {
    return { message: "Failed to update profile. Please try again." };
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true };
}

// ── Change password ───────────────────────────────────────────────────────────
const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword:     z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords do not match",
  path:    ["confirmPassword"],
});

export type ChangePasswordState = {
  errors?: {
    currentPassword?: string[];
    newPassword?:     string[];
    confirmPassword?: string[];
  };
  message?: string;
  success?: boolean;
};

export async function changePassword(
  _prev: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  // Ensure user is authenticated
  await requireUser();

  const raw = {
    currentPassword: formData.get("currentPassword"),
    newPassword:     formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = ChangePasswordSchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const { currentPassword, newPassword } = parsed.data;

  try {
    const result = await auth.api.changePassword({
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions: false,
      },
      headers: await headers(),
    });

    if (!result) {
      return { message: "Failed to change password. Please try again." };
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.toLowerCase().includes("incorrect") || msg.toLowerCase().includes("invalid")) {
      return { errors: { currentPassword: ["Current password is incorrect."] } };
    }
    return { message: "Failed to change password. Please try again." };
  }

  return { success: true };
}
