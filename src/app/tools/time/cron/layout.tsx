import type { ReactNode } from "react";
import { ToolSeoFaqServer } from "@/components/ToolSeoFaqServer";
import { buildToolMetadata } from "@/lib/seo";

export const metadata = buildToolMetadata({
  title: "Cron Parser/Builder - SuperTools",
  description:
    "Parse cron expressions and preview upcoming run times locally in your browser.",
  path: "/tools/time/cron",
});

export default function ToolLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      {children}
      <ToolSeoFaqServer path="/tools/time/cron" />
    </>
  );
}
