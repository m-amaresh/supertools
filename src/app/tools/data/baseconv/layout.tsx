import type { ReactNode } from "react";
import { ToolSeoFaqServer } from "@/components/ToolSeoFaqServer";
import { buildToolMetadata } from "@/lib/seo";

export const metadata = buildToolMetadata({
  title: "Number Base Converter - SuperTools",
  description:
    "Convert numbers between binary, octal, decimal, and hexadecimal locally in your browser.",
  path: "/tools/data/baseconv",
});

export default function ToolLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      {children}
      <ToolSeoFaqServer path="/tools/data/baseconv" />
    </>
  );
}
