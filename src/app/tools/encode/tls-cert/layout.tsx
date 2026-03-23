import type { ReactNode } from "react";
import { ToolSeoFaqServer } from "@/components/ToolSeoFaqServer";
import { buildToolMetadata } from "@/lib/seo";

export const metadata = buildToolMetadata({
  title: "TLS Certificate Content Viewer - SuperTools",
  description:
    "Inspect PEM TLS certificates locally and view subject, issuer, validity, SAN, and fingerprints.",
  path: "/tools/encode/tls-cert",
  keywords: [
    "tls certificate viewer",
    "x509 certificate parser",
    "pem certificate inspector",
    "certificate fingerprint",
    "subject alt names",
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
      <ToolSeoFaqServer path="/tools/encode/tls-cert" />
    </>
  );
}
