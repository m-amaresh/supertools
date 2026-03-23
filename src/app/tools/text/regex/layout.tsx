import type { ReactNode } from "react";
import { ToolSeoFaqServer } from "@/components/ToolSeoFaqServer";
import { buildToolMetadata } from "@/lib/seo";

export const metadata = buildToolMetadata({
  title: "Regex Tester - SuperTools",
  description:
    "Test regular expressions with live matches and capture groups entirely client-side.",
  path: "/tools/text/regex",
  keywords: [
    "regex tester",
    "regex test online",
    "regular expression tester",
    "regex checker",
    "regex match tool",
    "regex capture groups",
    "javascript regex tester",
    "regex playground",
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
      <ToolSeoFaqServer path="/tools/text/regex" />
    </>
  );
}
