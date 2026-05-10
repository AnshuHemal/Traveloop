import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/shared/logo";

export const metadata: Metadata = { title: "Page not found — Traveloop" };

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      {}
      <div aria-hidden className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_30%,oklch(0.92_0.06_185/0.25)_0%,transparent_70%)]" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="mb-2">
          <Logo size={32} />
        </div>

        <div className="flex flex-col items-center gap-3">
          <span className="text-7xl">🗺️</span>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            404
          </h1>
          <p className="text-xl font-semibold text-foreground">Page not found</p>
          <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
            Looks like this destination doesn&apos;t exist on our map. It may have been moved or deleted.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Go to dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
