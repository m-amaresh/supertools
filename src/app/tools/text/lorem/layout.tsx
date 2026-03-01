import type { ReactNode } from "react";
import { ToolSeoFaqServer } from "@/components/ToolSeoFaqServer";
import { buildToolMetadata } from "@/lib/seo";

export const metadata = buildToolMetadata({
  title: "Lorem Ipsum Generator - SuperTools",
  description:
    "Generate placeholder lorem ipsum text locally with adjustable output size.",
  path: "/tools/text/lorem",
});

export default function ToolLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      {children}
      <ToolSeoFaqServer path="/tools/text/lorem" />
    </>
  );
}
