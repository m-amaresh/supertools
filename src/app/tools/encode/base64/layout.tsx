import type { ReactNode } from "react";
import { ToolSeoFaqServer } from "@/components/ToolSeoFaqServer";
import { buildToolMetadata } from "@/lib/seo";

export const metadata = buildToolMetadata({
  title: "Base64 Encoder/Decoder - SuperTools",
  description:
    "Encode and decode Base64 for text and files locally in your browser.",
  path: "/tools/encode/base64",
  keywords: [
    "base64 encode",
    "base64 decode",
    "base64 encoder",
    "base64 decoder",
    "base64url",
    "encode to base64",
    "decode base64 online",
    "online base64 tool",
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
      <ToolSeoFaqServer path="/tools/encode/base64" />
    </>
  );
}
