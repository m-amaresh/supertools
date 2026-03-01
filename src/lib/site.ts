const LOCALHOST_URL = "http://localhost:3000";

function normalizeUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return normalizeUrl(explicit);

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    const withProtocol = vercelUrl.startsWith("http")
      ? vercelUrl
      : `https://${vercelUrl}`;
    return normalizeUrl(withProtocol);
  }

  return LOCALHOST_URL;
}

export function shouldIndexSite(): boolean {
  const env = process.env.VERCEL_ENV?.trim();
  return env ? env === "production" : true;
}
