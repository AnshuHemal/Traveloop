"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Auth error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm px-8 py-10 shadow-xl shadow-black/5">
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10">
            <AlertTriangle className="size-7 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Authentication error</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Something went wrong. Please try again.
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={reset}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="size-4" />
              Try again
            </button>
            <Link
              href="/login"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
