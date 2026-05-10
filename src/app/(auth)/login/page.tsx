import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { LoginForm } from "./_components/login-form";
import { OAuthButtons } from "../_components/oauth-buttons";
import { FadeIn } from "@/components/motion/fade-in";

export const metadata: Metadata = {
  title: "Sign in",
  description: `Sign in to your ${siteConfig.name} account and continue planning your next adventure.`,
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <FadeIn className="flex flex-col gap-5">

      {}
      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm px-8 py-9 shadow-xl shadow-black/5">

        {}
        <FadeIn direction="down" delay={0.05} className="mb-7 flex flex-col gap-1.5 text-center">
          <div className="mb-3 flex justify-center">
            <span className="text-3xl">✈️</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to continue your travel planning
          </p>
        </FadeIn>

        {}
        <FadeIn delay={0.1}>
          <OAuthButtons />
        </FadeIn>

        {}
        <FadeIn direction="none" delay={0.15} className="my-5 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground font-medium">or continue with email</span>
          <Separator className="flex-1" />
        </FadeIn>

        {}
        <FadeIn delay={0.2}>
          <Suspense>
            <LoginForm />
          </Suspense>
        </FadeIn>

      </div>

      {}
      <FadeIn direction="none" delay={0.28}>
        <p className="text-center text-sm text-muted-foreground">
          New to {siteConfig.name}?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Create a free account
          </Link>
        </p>
      </FadeIn>

    </FadeIn>
  );
}
