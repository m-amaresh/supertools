import type { ReactNode } from "react";
import { ToolSeoFaqServer } from "@/components/ToolSeoFaqServer";
import { buildToolMetadata } from "@/lib/seo";

export const metadata = buildToolMetadata({
  title: "Base58/Base58Check Encoder/Decoder - SuperTools",
  description:
    "Encode and decode Base58 plus Base58Check payloads locally in your browser.",
  path: "/tools/encode/base58",
  keywords: [
    "base58 encode",
    "base58 decode",
    "base58check",
    "bitcoin base58",
    "base58 converter",
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
      <ToolSeoFaqServer path="/tools/encode/base58" />
    </>
  );
}
