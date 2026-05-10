import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { FadeIn } from "@/components/motion/fade-in";
import { SettingsClient } from "./_components/settings-client";

export const metadata: Metadata = { title: "Settings — Traveloop" };

export default async function SettingsPage() {
  const user = await requireUser();
  return (
    <div className="flex flex-col gap-8 pb-16">
      <FadeIn direction="down">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary/90 to-primary/70 px-6 py-8 sm:px-8 sm:py-10">
          <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <span className="text-2xl">⚙️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Settings</h1>
              <p className="mt-0.5 text-sm text-white/75">Manage your account and preferences</p>
            </div>
          </div>
        </div>
      </FadeIn>
      <FadeIn delay={0.1}>
        <SettingsClient user={user} />
      </FadeIn>
    </div>
  );
}
