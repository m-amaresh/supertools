import type { ReactNode } from "react";
import { ToolSeoFaqServer } from "@/components/ToolSeoFaqServer";
import { buildToolMetadata } from "@/lib/seo";

export const metadata = buildToolMetadata({
  title: "Color Converter - SuperTools",
  description:
    "Convert colors between HEX, RGB, and HSL with local client-side processing.",
  path: "/tools/data/color",
});

export default function ToolLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      {children}
      <ToolSeoFaqServer path="/tools/data/color" />
    </>
  );
}
