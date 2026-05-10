"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { motion } from "motion/react";
import { Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface LoadMoreProps {
  currentPage: number;
  hasMore: boolean;
  totalCount: number;
  shownCount: number;
}

export function LoadMore({ currentPage, hasMore, totalCount, shownCount }: LoadMoreProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (!hasMore) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-sm text-muted-foreground py-4"
      >
        Showing all {totalCount} trip{totalCount !== 1 ? "s" : ""}
      </motion.p>
    );
  }

  function handleLoadMore() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(currentPage + 1));
    startTransition(() => router.push(`${pathname}?${params.toString()}`, { scroll: false }));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-2 py-4"
    >
      <p className="text-xs text-muted-foreground">
        Showing {shownCount} of {totalCount} trips
      </p>
      <button
        onClick={handleLoadMore}
        disabled={isPending}
        className={cn(buttonVariants({ variant: "outline" }), "gap-2 min-w-36")}
      >
        {isPending ? (
          <><Loader2 className="size-4 animate-spin" /> Loading…</>
        ) : (
          <><ChevronDown className="size-4" /> Load more</>
        )}
      </button>
    </motion.div>
  );
}
