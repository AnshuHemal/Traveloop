"use server";

import { cookies } from "next/headers";

interface OnboardingData {
  travelerType: string | null;
  tripTemplate: string | null;
}

// We store onboarding completion in a cookie so we don't need a DB column.
// In production you'd add an `onboardingCompleted` field to the User model.
export async function completeOnboarding(data: OnboardingData): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("traveloop_onboarded", "1", {
    path:    "/",
    maxAge:  60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
    secure:  process.env.NODE_ENV === "production",
  });

  // Optionally log the traveler type for analytics
  if (data.travelerType) {
    // Could store in DB: await prisma.user.update({ where: { id: userId }, data: { travelerType: data.travelerType } })
    // For now just a no-op — the cookie is enough to skip onboarding next time
  }
}

export async function hasCompletedOnboarding(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has("traveloop_onboarded");
}
