import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export default function SharedTripNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div aria-hidden className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_30%,oklch(0.92_0.06_185/0.2)_0%,transparent_70%)]" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <Logo size={28} />

        <div className="flex flex-col items-center gap-3">
          <span className="text-6xl">🔒</span>
          <h1 className="text-2xl font-bold text-foreground">Trip not available</h1>
          <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
            This trip link is no longer active. It may have been made private or deleted by the owner.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Plan your own trip →
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
