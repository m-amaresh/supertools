import type { ReactNode } from "react";
import { ToolSeoFaqServer } from "@/components/ToolSeoFaqServer";
import { buildToolMetadata } from "@/lib/seo";

export const metadata = buildToolMetadata({
  title: "Hash Generator - SuperTools",
  description:
    "Generate MD5, SHA, SHA3, and HMAC hashes in your browser without server upload.",
  path: "/tools/encode/hash",
  keywords: [
    "hash generator",
    "sha256 generator",
    "md5 hash",
    "sha512 hash",
    "hmac generator",
    "hash text online",
    "checksum generator",
    "sha3-256",
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
      <ToolSeoFaqServer path="/tools/encode/hash" />
    </>
  );
}
