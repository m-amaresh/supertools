const LOCALHOST_URL = "http://localhost:3100";
const PRODUCTION_SITE_URL = "https://supertools.amaresh.me";

function normalizeUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

// Resolve the canonical site URL and keep CI/Vercel builds strict about config.
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return normalizeUrl(explicit);

  if (typeof window === "undefined" && (process.env.VERCEL || process.env.CI)) {
    throw new Error(
      "Missing env var: NEXT_PUBLIC_SITE_URL must be set in production builds",
    );
  }

  return process.env.VERCEL ? PRODUCTION_SITE_URL : LOCALHOST_URL;
}

export function shouldIndexSite(): boolean {
  const env = process.env.VERCEL_ENV?.trim();
  return env ? env === "production" : true;
}
