import type { ReactNode } from "react";
import { ToolSeoFaqServer } from "@/components/ToolSeoFaqServer";
import { buildToolMetadata } from "@/lib/seo";

export const metadata = buildToolMetadata({
  title: "Base32 Encoder/Decoder - SuperTools",
  description: "Encode and decode Base32 with client-side processing only.",
  path: "/tools/encode/base32",
});

export default function ToolLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      {children}
      <ToolSeoFaqServer path="/tools/encode/base32" />
    </>
  );
}
