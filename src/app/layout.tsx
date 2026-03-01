import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GLOBAL_KEYWORDS } from "@/lib/seo";
import { getSiteUrl, shouldIndexSite } from "@/lib/site";
import { APP_VERSION } from "@/lib/version";

const inter = localFont({
  src: "./fonts/Inter-Latin-Variable.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

const jetbrainsMono = localFont({
  src: "./fonts/JetBrainsMono-Latin-Variable.woff2",
  variable: "--font-jetbrains",
  display: "swap",
  weight: "100 800",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "SuperTools",
  description:
    "Fast, privacy-first developer utilities that run 100% in your browser",
  applicationName: "SuperTools",
  category: "Developer Tools",
  keywords: GLOBAL_KEYWORDS,
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "SuperTools",
    title: "SuperTools",
    description:
      "Fast, privacy-first developer utilities that run 100% in your browser",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SuperTools - Privacy-first browser developer tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SuperTools",
    description:
      "Fast, privacy-first developer utilities that run 100% in your browser",
    images: ["/twitter-image"],
  },
  robots: shouldIndexSite()
    ? { index: true, follow: true }
    : { index: false, follow: false },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <AppShell version={APP_VERSION}>{children}</AppShell>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
