import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { hasCompletedOnboarding } from "./actions";
import { OnboardingWizard } from "./_components/onboarding-wizard";

export const metadata: Metadata = {
  title: "Welcome to Traveloop",
  description: "Set up your travel profile and start planning your first trip.",
};

export default async function OnboardingPage() {
  const user = await requireUser();

  const done = await hasCompletedOnboarding();
  if (done) redirect("/dashboard");

  return <OnboardingWizard userName={user.name ?? "Traveler"} />;
}
