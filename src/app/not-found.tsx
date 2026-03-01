import { faCompass } from "@fortawesome/free-solid-svg-icons/faCompass";
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found - SuperTools",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="p-1 lg:p-2">
      <div className="mx-auto w-full max-w-[960px]">
        <section className="glass-panel rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
            Page Not Found
          </div>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            This route does not exist
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            The link may be outdated, mistyped, or moved. Return to the tool
            gallery to continue.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-[13px] font-medium text-primary-foreground shadow-sm transition-all duration-150 hover:opacity-90"
            >
              <FontAwesomeIcon
                icon={faHouse}
                className="h-3.5 w-3.5"
                aria-hidden="true"
              />
              Back to Home
            </Link>
            <Link
              href="/#all-tools"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
            >
              <FontAwesomeIcon
                icon={faCompass}
                className="h-3.5 w-3.5"
                aria-hidden="true"
              />
              Browse Tools
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
