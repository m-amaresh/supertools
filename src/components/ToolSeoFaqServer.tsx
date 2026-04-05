import { SeoFaq } from "@/components/SeoFaq";
import { TOOL_FAQ_BY_PATH } from "@/lib/tool-seo";

interface ToolSeoFaqServerProps {
  path: string;
}

export function ToolSeoFaqServer({ path }: ToolSeoFaqServerProps) {
  const section = TOOL_FAQ_BY_PATH[path];
  if (!section) return null;

  return (
    <SeoFaq
      title={section.title}
      about={section.about}
      howToUse={section.howToUse}
      items={section.items}
    />
  );
}
