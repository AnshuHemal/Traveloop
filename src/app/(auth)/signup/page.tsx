import type { Metadata } from "next";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { SignupForm } from "./_components/signup-form";
import { OAuthButtons } from "../_components/oauth-buttons";
import { FadeIn } from "@/components/motion/fade-in";

export const metadata: Metadata = {
  title: "Create account",
  description: `Create your free ${siteConfig.name} account and start planning your dream trips today.`,
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <FadeIn className="flex flex-col gap-5">

      {/* Card */}
      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm px-8 py-9 shadow-xl shadow-black/5">

        {/* Header */}
        <FadeIn direction="down" delay={0.05} className="mb-7 flex flex-col gap-1.5 text-center">
          <div className="mb-3 flex justify-center">
            <span className="text-3xl">🌍</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Start your journey
          </h1>
          <p className="text-sm text-muted-foreground">
            Free forever — no credit card required
          </p>
        </FadeIn>

        {/* OAuth */}
        <FadeIn delay={0.1}>
          <OAuthButtons />
        </FadeIn>

        {/* Divider */}
        <FadeIn direction="none" delay={0.15} className="my-5 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground font-medium">or sign up with email</span>
          <Separator className="flex-1" />
        </FadeIn>

        {/* Form */}
        <FadeIn delay={0.2}>
          <SignupForm />
        </FadeIn>

        {/* Terms */}
        <FadeIn direction="none" delay={0.28}>
          <p className="mt-5 text-center text-xs text-muted-foreground leading-relaxed">
            By signing up you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-foreground transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            .
          </p>
        </FadeIn>

      </div>

      {/* Login link */}
      <FadeIn direction="none" delay={0.32}>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </FadeIn>

    </FadeIn>
  );
}
