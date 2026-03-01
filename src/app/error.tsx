"use client";

import { useEffect } from "react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[AppError]", error);
  }, [error]);
  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-2xl rounded-lg border border-border bg-card p-5 shadow-sm">
        <h2 className="text-[18px] font-semibold tracking-tight text-foreground">
          Something went wrong
        </h2>
        <p className="mt-2 text-[14px] text-muted-foreground">
          The page hit an unexpected error. You can retry safely.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3.5 text-[13px] font-medium text-primary-foreground shadow-sm transition-all duration-150 hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
