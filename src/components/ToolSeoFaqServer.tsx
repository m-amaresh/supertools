import { SeoFaq } from "@/components/SeoFaq";
import { TOOL_FAQ_BY_PATH } from "@/lib/tool-seo";

interface ToolSeoFaqServerProps {
  path: string;
}

export function ToolSeoFaqServer({ path }: ToolSeoFaqServerProps) {
  const faq = TOOL_FAQ_BY_PATH[path];
  if (!faq) return null;

  return <SeoFaq title={faq.title} items={faq.items} />;
}
