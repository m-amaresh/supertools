import type { ReactNode } from "react";
import { ToolSeoFaqServer } from "@/components/ToolSeoFaqServer";
import { buildToolMetadata } from "@/lib/seo";

export const metadata = buildToolMetadata({
  title: "Case Converter - SuperTools",
  description:
    "Convert text between camelCase, snake_case, kebab-case, and more locally.",
  path: "/tools/text/case",
});

export default function ToolLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      {children}
      <ToolSeoFaqServer path="/tools/text/case" />
    </>
  );
}
