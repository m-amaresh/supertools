import type { ReactNode } from "react";
import { ToolSeoFaqServer } from "@/components/ToolSeoFaqServer";
import { buildToolMetadata } from "@/lib/seo";

export const metadata = buildToolMetadata({
  title: "CSV/TSV ↔ JSON Converter - SuperTools",
  description:
    "Convert CSV or TSV data to JSON and convert JSON arrays back to CSV/TSV locally in your browser.",
  path: "/tools/data/csv",
  keywords: [
    "csv to json",
    "json to csv",
    "tsv to json",
    "json to tsv",
    "csv converter",
    "delimited data converter",
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
      <ToolSeoFaqServer path="/tools/data/csv" />
    </>
  );
}
