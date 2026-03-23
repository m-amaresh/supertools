import type { ReactNode } from "react";
import { ToolSeoFaqServer } from "@/components/ToolSeoFaqServer";
import { buildToolMetadata } from "@/lib/seo";

export const metadata = buildToolMetadata({
  title: "String Escape/Unescape - SuperTools",
  description:
    "Escape and unescape strings for HTML, JSON, URL, and regex patterns locally.",
  path: "/tools/encode/escape",
});

export default function ToolLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      {children}
      <ToolSeoFaqServer path="/tools/encode/escape" />
    </>
  );
}
