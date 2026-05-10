"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function SignupForm() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const form = e.currentTarget;
    const firstName = (form.elements.namedItem("firstName") as HTMLInputElement).value.trim();
    const lastName  = (form.elements.namedItem("lastName")  as HTMLInputElement).value.trim();
    const email     = (form.elements.namedItem("email")     as HTMLInputElement).value.trim();
    const password  = (form.elements.namedItem("password")  as HTMLInputElement).value;

    const { error: authError } = await signUp.email({
      email,
      password,
      name: `${firstName} ${lastName}`.trim(),
      callbackURL: "/dashboard",
    });

    if (authError) {
      setError(authError.message ?? "Something went wrong. Please try again.");
      setIsPending(false);
      return;
    }

    const params = new URLSearchParams({ email, password });
    window.location.href = `/verify-email?${params.toString()}`;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="firstName" className="text-sm font-medium">First name</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Alex"
            autoComplete="given-name"
            required
            disabled={isPending}
            className="h-11"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lastName" className="text-sm font-medium">Last name</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Rivera"
            autoComplete="family-name"
            required
            disabled={isPending}
            className="h-11"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          disabled={isPending}
          className="h-11"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            minLength={8}
            required
            disabled={isPending}
            className="h-11 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
      </div>

      {error && (
        <div className={cn(
          "rounded-lg border px-3.5 py-2.5 text-sm",
          "bg-destructive/8 border-destructive/20 text-destructive"
        )}>
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="mt-1 h-11 w-full font-semibold"
        disabled={isPending}
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Creating account…
          </span>
        ) : (
          "Start planning for free"
        )}
      </Button>
    </form>
  );
}
