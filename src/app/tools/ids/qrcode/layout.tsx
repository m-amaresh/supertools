import type { ReactNode } from "react";
import { ToolSeoFaqServer } from "@/components/ToolSeoFaqServer";
import { buildToolMetadata } from "@/lib/seo";

export const metadata = buildToolMetadata({
  title: "QR Code Generator - SuperTools",
  description:
    "Generate QR codes for URLs, Wi-Fi, vCards, and any text — entirely in your browser.",
  path: "/tools/ids/qrcode",
  keywords: [
    "qr code generator",
    "qr generator",
    "create qr code",
    "url qr code",
    "wifi qr code",
    "vcard qr code",
    "download qr code svg",
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
      <ToolSeoFaqServer path="/tools/ids/qrcode" />
    </>
  );
}
