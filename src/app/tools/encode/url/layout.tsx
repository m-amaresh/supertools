import type { ReactNode } from "react";
import { ToolSeoFaqServer } from "@/components/ToolSeoFaqServer";
import { buildToolMetadata } from "@/lib/seo";

export const metadata = buildToolMetadata({
  title: "URL Encoder/Decoder - SuperTools",
  description:
    "Encode and decode URL components locally with no server-side processing.",
  path: "/tools/encode/url",
});

export default function ToolLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      {children}
      <ToolSeoFaqServer path="/tools/encode/url" />
    </>
  );
}
