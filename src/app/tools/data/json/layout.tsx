import type { ReactNode } from "react";
import { ToolSeoFaqServer } from "@/components/ToolSeoFaqServer";
import { buildToolMetadata } from "@/lib/seo";

export const metadata = buildToolMetadata({
  title: "JSON Formatter - SuperTools",
  description: "Format, validate, and minify JSON entirely in your browser.",
  path: "/tools/data/json",
  keywords: [
    "json formatter",
    "json beautifier",
    "json minify",
    "json validator",
    "format json online",
    "json prettify",
    "json parser",
    "fix json",
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
      <ToolSeoFaqServer path="/tools/data/json" />
    </>
  );
}
