"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center font-sans antialiased">
        <div className="flex flex-col items-center gap-6">
          <div className="flex size-20 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/20">
            <AlertTriangle className="size-10 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Critical error
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Something went seriously wrong. Please refresh the page.
            </p>
            {error.digest && (
              <p className="mt-1 text-xs text-gray-400 font-mono">
                {error.digest}
              </p>
            )}
          </div>
          <button
            onClick={reset}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="size-4" />
            Reload page
          </button>
        </div>
      </body>
    </html>
  );
}
