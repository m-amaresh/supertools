import type { ReactNode } from "react";
import { ToolSeoFaqServer } from "@/components/ToolSeoFaqServer";
import { buildToolMetadata } from "@/lib/seo";

export const metadata = buildToolMetadata({
  title: "CRC32 Checksum - SuperTools",
  description:
    "Generate CRC32 checksums for text and files entirely client-side.",
  path: "/tools/encode/crc32",
});

export default function ToolLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      {children}
      <ToolSeoFaqServer path="/tools/encode/crc32" />
    </>
  );
}
