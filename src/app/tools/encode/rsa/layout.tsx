import type { ReactNode } from "react";
import { ToolSeoFaqServer } from "@/components/ToolSeoFaqServer";
import { buildToolMetadata } from "@/lib/seo";

export const metadata = buildToolMetadata({
  title: "RSA Sign/Verify - SuperTools",
  description:
    "Sign and verify messages with RSA keys locally in your browser.",
  path: "/tools/encode/rsa",
});

export default function ToolLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      {children}
      <ToolSeoFaqServer path="/tools/encode/rsa" />
    </>
  );
}
