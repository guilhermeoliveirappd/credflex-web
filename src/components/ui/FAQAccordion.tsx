import { Plus } from "lucide-react";
import { ReviewMark } from "@/components/brand/ReviewMark";
import type { FaqItem } from "@/content/types";
import { JsonLd, faqJsonLd } from "@/lib/seo/metadata";

/** <details>/<summary>: acessível por teclado e leitor de tela sem JavaScript. */
export function FAQAccordion({ items, emitJsonLd = true }: { items: FaqItem[]; emitJsonLd?: boolean }) {
  const confirmed = items.filter((i) => i.status === "confirmed");
  return (
    <div className="border-t border-sand">
      {items.map((item) => (
        <details key={item.q} className="group border-b border-sand">
          <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-semibold text-navy-950 transition-colors hover:text-navy-700 [&::-webkit-details-marker]:hidden">
            <span className="text-[1.08rem] leading-snug">
              {item.q} <ReviewMark status={item.status} />
            </span>
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-sand-600 transition-[transform,background-color] duration-300 group-open:rotate-45 group-open:border-gold-400 group-open:bg-gold-400">
              <Plus aria-hidden className="h-4 w-4" />
            </span>
          </summary>
          <div className="max-w-[68ch] pb-6 pr-14 text-ink-2">{item.a}</div>
        </details>
      ))}
      {/* Somente respostas confirmadas viram dados estruturados. */}
      {emitJsonLd && confirmed.length > 0 && <JsonLd data={faqJsonLd(confirmed)} />}
    </div>
  );
}
