import type { ReactNode } from "react";
import { ToolSeoFaqServer } from "@/components/ToolSeoFaqServer";
import { buildToolMetadata } from "@/lib/seo";

export const metadata = buildToolMetadata({
  title: "URL Parser & Query Builder - SuperTools",
  description:
    "Parse URLs into components and build query strings interactively in your browser.",
  path: "/tools/encode/url-parser",
  keywords: [
    "url parser",
    "query string builder",
    "url query editor",
    "parse url online",
    "url components",
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
      <ToolSeoFaqServer path="/tools/encode/url-parser" />
    </>
  );
}
