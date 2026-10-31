import type { Metadata } from "next";
import Link from "next/link";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { PageHero } from "@/components/ui/PageHero";
import { generalFaq } from "@/content/institutional";
import { activeProducts } from "@/content/products";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Ajuda",
  description: "Respostas para as dúvidas mais comuns sobre a CredFlex, a pré-análise e cada modalidade de crédito.",
  path: "/ajuda",
});

const glossary = [
  ["CET (Custo Efetivo Total)", "Soma de juros, tarifas, tributos e seguros, expressa como taxa. É o melhor número para comparar propostas."],
  ["Margem consignável", "Parte da renda ou do benefício que pode ser comprometida com parcelas descontadas em folha ou no benefício."],
  ["Correspondente bancário", "Empresa contratada por instituições financeiras para apresentar e intermediar produtos, como crédito."],
  ["Portabilidade", "Transferência de um contrato de crédito existente para outra instituição, que pode oferecer condições diferentes."],
];

export default function AjudaPage() {
  return (
    <>
      <PageHero crumb="Ajuda" path="/ajuda" title="Como podemos ajudar?" lead="Dúvidas gerais, perguntas por modalidade e um pequeno glossário para entender os termos do crédito." />
      <section aria-labelledby="geral-title" className="bg-paper py-[var(--section-y)]">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <nav aria-label="Seções da ajuda" className="lg:col-span-3">
            <div className="rounded-[var(--radius-md)] bg-paper-2 p-4 sm:p-6 lg:sticky lg:top-[calc(var(--header-h)+32px)]">
              <p className="mb-3 px-3 text-[0.85rem] font-semibold uppercase tracking-[0.08em] text-stone">Nesta página</p>
              <ul className="space-y-1">
                <li>
                  <a href="#geral" className="flex min-h-11 items-center rounded-[var(--radius-sm)] px-3 py-2 font-semibold text-brand-900 transition-colors hover:bg-white">
                    Dúvidas gerais
                  </a>
                </li>
                {activeProducts.filter((p) => p.faq.length).map((p) => (
                  <li key={p.slug}>
                    <a href={`#faq-${p.slug}`} className="flex min-h-11 items-center rounded-[var(--radius-sm)] px-3 py-2 leading-snug text-ink-2 transition-colors hover:bg-white hover:text-brand-900">
                      {p.name}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#glossario" className="flex min-h-11 items-center rounded-[var(--radius-sm)] px-3 py-2 font-semibold text-brand-900 transition-colors hover:bg-white">
                    Glossário
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          <div className="space-y-16 lg:col-span-8 lg:col-start-5">
            <div id="geral">
              <h2 id="geral-title" className="t-h3 mb-6 text-brand-950">Dúvidas gerais</h2>
              <FAQAccordion items={generalFaq} />
            </div>
            {activeProducts.filter((p) => p.faq.length).map((p) => (
              <div key={p.slug} id={`faq-${p.slug}`}>
                <h2 className="t-h3 mb-6 text-brand-950">
                  <Link href={`/${p.slug}`} className="hover:underline">{p.name}</Link>
                </h2>
                <FAQAccordion items={p.faq} emitJsonLd={false} />
              </div>
            ))}
            <div id="glossario">
              <h2 className="t-h3 mb-6 text-brand-950">Glossário</h2>
              <dl className="divide-y divide-sand border-y border-sand">
                {glossary.map(([t, d]) => (
                  <div key={t} className="grid gap-2 py-5 sm:grid-cols-[14rem_1fr]">
                    <dt className="font-bold text-brand-950">{t}</dt>
                    <dd data-support className="text-ink-2">{d}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
