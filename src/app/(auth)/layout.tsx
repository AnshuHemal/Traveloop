import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { FadeIn } from "@/components/motion/fade-in";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { getSession } from "@/lib/session";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12 overflow-hidden">

      {}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 10%, oklch(0.92 0.06 185 / 0.35) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 90%, oklch(0.88 0.08 160 / 0.25) 0%, transparent 55%), radial-gradient(ellipse 100% 80% at 50% 50%, oklch(0.96 0.02 185 / 0.15) 0%, transparent 70%)",
        }}
      />

      {}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] opacity-30"
      />

      {}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_50%,transparent_35%,var(--background)_100%)]"
      />

      {}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-1/4 size-64 rounded-full bg-primary/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/4 bottom-1/4 size-48 rounded-full bg-primary/6 blur-3xl"
      />

      {}
      <FadeIn direction="down" className="absolute left-6 top-6 z-10">
        <Logo size={28} />
      </FadeIn>

      <div className="absolute right-6 top-6 z-10">
        <ThemeToggle />
      </div>

      {}
      <main className="relative z-10 w-full max-w-sm">
        {children}
      </main>

      {}
      <FadeIn
        direction="none"
        delay={0.4}
        className="relative z-10 mt-8 flex items-center gap-4 text-sm text-muted-foreground"
      >
        <Link href="/privacy" className="hover:text-foreground transition-colors">
          Privacy
        </Link>
        <span aria-hidden>·</span>
        <Link href="/terms" className="hover:text-foreground transition-colors">
          Terms
        </Link>
        <span aria-hidden>·</span>
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
      </FadeIn>
    </div>
  );
}
