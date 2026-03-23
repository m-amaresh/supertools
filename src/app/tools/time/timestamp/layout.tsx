import type { ReactNode } from "react";
import { ToolSeoFaqServer } from "@/components/ToolSeoFaqServer";
import { buildToolMetadata } from "@/lib/seo";

export const metadata = buildToolMetadata({
  title: "Timestamp Converter - SuperTools",
  description:
    "Convert Unix timestamps to human-readable date formats and back locally.",
  path: "/tools/time/timestamp",
  keywords: [
    "timestamp converter",
    "unix timestamp converter",
    "epoch converter",
    "unix to date",
    "date to unix timestamp",
    "timestamp to utc",
    "epoch time converter",
    "iso 8601 converter",
  ],
});

export default function ToolLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      {children}
      <ToolSeoFaqServer path="/tools/time/timestamp" />
    </>
  );
}
