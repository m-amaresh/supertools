"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#fff", color: "#111" }}>
        <div className="min-h-screen p-6 lg:p-8">
          <div className="max-w-2xl rounded-lg border border-border bg-card p-5 shadow-sm">
            <h2 className="text-[18px] font-semibold tracking-tight text-foreground">
              Application error
            </h2>
            <p className="mt-2 text-[14px] text-muted-foreground">
              An unrecoverable error occurred in the app shell.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3.5 text-[13px] font-medium text-primary-foreground shadow-sm transition-all duration-150 hover:opacity-90"
            >
              Reload app
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
