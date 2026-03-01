import { cn } from "@/lib/utils";

export interface SeoFaqItem {
  question: string;
  answer: string;
}

interface SeoFaqProps {
  title: string;
  items: SeoFaqItem[];
  className?: string;
}

export function SeoFaq({ title, items, className }: SeoFaqProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className={cn("mt-6", className)} aria-label={title}>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <div className="glass-panel rounded-xl border border-border p-4 sm:p-5">
        <h2 className="text-[14px] font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <div className="mt-3 space-y-3">
          {items.map((item) => (
            <div key={item.question}>
              <h3 className="text-[13px] font-medium text-foreground">
                {item.question}
              </h3>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
