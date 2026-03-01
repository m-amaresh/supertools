import type { NextConfig } from "next";
import { version } from "./package.json";

const isDev = process.env.NODE_ENV !== "production";
const VERCEL_ANALYTICS_SCRIPT_SRC = "https://va.vercel-scripts.com";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${VERCEL_ANALYTICS_SCRIPT_SRC}${isDev ? " 'unsafe-eval'" : ""}`,
  "script-src-attr 'none'",
  `script-src-elem 'self' 'unsafe-inline' ${VERCEL_ANALYTICS_SCRIPT_SRC}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          {
            key: "Content-Security-Policy",
            value: csp,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
