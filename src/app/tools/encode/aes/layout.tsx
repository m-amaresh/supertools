import type { ReactNode } from "react";
import { ToolSeoFaqServer } from "@/components/ToolSeoFaqServer";
import { buildToolMetadata } from "@/lib/seo";

export const metadata = buildToolMetadata({
  title: "AES-GCM Encrypt/Decrypt - SuperTools",
  description:
    "Encrypt and decrypt text or files with AES-GCM locally in your browser.",
  path: "/tools/encode/aes",
});

export default function ToolLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      {children}
      <ToolSeoFaqServer path="/tools/encode/aes" />
    </>
  );
}
