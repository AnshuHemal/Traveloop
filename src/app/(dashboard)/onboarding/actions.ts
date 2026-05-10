"use server";

import { cookies } from "next/headers";

interface OnboardingData {
  travelerType: string | null;
  tripTemplate: string | null;
}

export async function completeOnboarding(data: OnboardingData): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("traveloop_onboarded", "1", {
    path:    "/",
    maxAge:  60 * 60 * 24 * 365,
    sameSite: "lax",
    secure:  process.env.NODE_ENV === "production",
  });

  if (data.travelerType) {

  }
}

export async function hasCompletedOnboarding(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has("traveloop_onboarded");
}
