import type { ReactNode } from "react";
import { ToolSeoFaqServer } from "@/components/ToolSeoFaqServer";
import { buildToolMetadata } from "@/lib/seo";

export const metadata = buildToolMetadata({
  title: "CIDR / Subnet Calculator - SuperTools",
  description:
    "Calculate IPv4 and IPv6 subnet ranges, masks, and host counts locally in your browser.",
  path: "/tools/network/cidr",
  keywords: [
    "cidr calculator",
    "subnet calculator",
    "ipv4 subnet",
    "ipv6 subnet",
    "network mask",
    "ip range calculator",
    "wildcard mask",
    "cidr to netmask",
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
      <ToolSeoFaqServer path="/tools/network/cidr" />
    </>
  );
}
