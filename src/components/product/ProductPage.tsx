import Link from "next/link";
import { AlertTriangle, ArrowRight, FileText, ListChecks } from "lucide-react";
import { FactText, ReviewMark } from "@/components/brand/ReviewMark";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { OfficialChannelNotice } from "@/components/ui/OfficialChannelNotice";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";
import { activeProducts, products, type Product } from "@/content/products";
import { HeroVisual } from "./HeroVisual";

const comparisonRows = ["Taxa de juros mensal", "Custo Efetivo Total (CET)", "Parcelas restantes", "Valor da parcela", "Saldo devedor"];

export function ProductPage({ product: p }: { product: Product }) {
  const dark = p.layout === "portability" || p.layout === "public";
  const prequalHref = `/simulacao?modalidade=${p.slug}`;

  if (p.status !== "active") return <ConditionalProductPage product={p} />;

  return (
    <>
      {/* PageHero — composição varia conforme a modalidade */}
      <section aria-labelledby="produto-title" className={dark ? "bg-brand-950 text-white" : "bg-accent-400 text-brand-950"}>
        <div className="container-x pb-16 pt-8 lg:pb-24 lg:pt-10">
          <Breadcrumbs items={[{ name: p.name, path: `/${p.slug}` }]} tone={dark ? "light" : "dark"} />
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-12">
            <div className={p.layout === "benefit" ? "lg:col-span-6" : "lg:col-span-7"}>
              <h1 id="produto-title" className={`t-h1 ${dark ? "text-white" : "text-brand-950"} ${p.layout === "benefit" ? "!text-[clamp(2.25rem,1.6rem+2.8vw,3.9rem)]" : ""}`}>
                {p.heroTitle}
              </h1>
              <p className={`t-lead mt-6 max-w-[44ch] ${dark ? "text-brand-100" : "text-ink-2"}`}>{p.heroLead}</p>
              <div className="mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
                <Link href={prequalHref} data-cta={`product_hero_${p.slug}`} className={`btn ${dark ? "btn-primary" : "btn-brand"}`}>
                  {p.ctaLabel}
                  <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                </Link>
                <a href="#como-funciona-produto" className={`btn btn-ghost ${dark ? "text-white" : "text-brand-900"}`}>
                  Como funciona
                </a>
              </div>
            </div>
            <div className={`${p.layout === "benefit" ? "lg:col-span-5 lg:col-start-8" : "lg:col-span-5"} ${dark ? "text-ink" : ""}`}>
              <HeroVisual layout={p.layout} />
            </div>
          </div>
        </div>
      </section>

      {/* Mecanismo + público */}
      <section aria-labelledby="para-quem-title" className="bg-paper py-[var(--section-y)]">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="para-quem-title" title={p.summary} />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="t-lead text-ink-2">{p.mechanism}</p>
            <ul className="mt-8 space-y-3">
              {p.forWhom.map((f) => (
                <li key={f.text} className="flex gap-3 border-t border-sand pt-3">
                  <span aria-hidden className="mt-[0.65em] h-[2px] w-4 flex-none bg-accent-500" />
                  <span>
                    <FactText fact={f} />
                  </span>
                </li>
              ))}
            </ul>
            {p.slug === "consignado-inss" && (
              <Link href="/portabilidade-inss" className="mt-8 flex items-center justify-between gap-4 rounded-[var(--radius-sm)] border border-sand bg-white p-5 hover:border-brand-500">
                <span>
                  <span className="block font-bold text-brand-950">Já tem consignado?</span>
                  <span className="t-small text-ink-2">Veja se faz sentido a portabilidade do contrato.</span>
                </span>
                <ArrowRight aria-hidden className="h-5 w-5 flex-none text-brand-700" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Portabilidade: planilha honesta de comparação, para o usuário preencher com a proposta real */}
      {p.layout === "portability" && (
        <section aria-labelledby="comparar-title" className="bg-accent-400 py-[var(--section-y)]">
          <div className="container-x">
            <SectionHeading
              id="comparar-title"
              title="Compare linha por linha."
              lead="Peça os dois números por escrito: o do contrato atual e o da proposta. Se o CET da proposta não for menor, a portabilidade pode não valer a pena."
            />
            <div className="mt-10 overflow-x-auto rounded-[var(--radius-md)] border border-sand bg-white">
              <table className="w-full min-w-[520px] text-left">
                <caption className="sr-only">Itens a comparar entre o contrato atual e a proposta de portabilidade</caption>
                <thead className="bg-brand-900 text-white">
                  <tr>
                    <th scope="col" className="px-5 py-4 font-semibold">Item</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Contrato atual</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Proposta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand">
                  {comparisonRows.map((r) => (
                    <tr key={r}>
                      <th scope="row" className="px-5 py-4 font-semibold text-brand-950">{r}</th>
                      <td className="px-5 py-4 text-stone">peça por escrito</td>
                      <td className="px-5 py-4 text-stone">peça por escrito</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Como funciona — o traço conecta as etapas */}
      <section id="como-funciona-produto" aria-labelledby="etapas-title" className="bg-brand-900 py-[var(--section-y)] text-white">
        <div className="container-x">
          <SectionHeading id="etapas-title" tone="light" title={`${p.shortName}, passo a passo.`} />
          <ol className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-md)] bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {p.steps.map((s, i) => (
              <li key={s.title} className="bg-brand-900 p-6 sm:p-7">
                <span className="t-num font-[family-name:var(--font-display)] text-4xl font-semibold text-accent-400">{i + 1}</span>
                <h3 className="mt-6 text-[1.15rem] font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-brand-100">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Requisitos, documentos, restrições */}
      <section aria-labelledby="requisitos-title" className="bg-paper py-[var(--section-y)]">
        <div className="container-x">
          <SectionHeading id="requisitos-title" title="O que é preciso saber antes." className="max-w-3xl" />
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            <FactList icon={<ListChecks aria-hidden className="h-5 w-5" />} title="Requisitos" facts={p.requirements} />
            <FactList icon={<FileText aria-hidden className="h-5 w-5" />} title="Documentos" facts={p.documents} />
            <FactList icon={<AlertTriangle aria-hidden className="h-5 w-5" />} title="Restrições e condições" facts={p.restrictions} tone="warn" />
          </div>
          <OfficialChannelNotice className="mt-8" />
        </div>
      </section>

      {p.faq.length > 0 && (
        <section aria-labelledby="faq-produto-title" className="bg-accent-400 py-[var(--section-y)]">
          <div className="container-x grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading id="faq-produto-title" title={`Perguntas sobre ${p.shortName}`} />
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <FAQAccordion items={p.faq} tone="accent" />
            </div>
          </div>
        </section>
      )}

      <OtherProducts current={p.slug} />

      <FinalCTA title="O próximo passo é uma conversa." text={`Responda às perguntas sobre ${p.name}. Uma pessoa da equipe retorna com as possibilidades para o seu caso.`} href={prequalHref} label={p.ctaLabel} tone="brand" />
    </>
  );
}

function FactList({ icon, title, facts, tone = "default" }: { icon: React.ReactNode; title: string; facts: Product["requirements"]; tone?: "default" | "warn" }) {
  return (
    <div className={`rounded-[var(--radius-md)] p-6 sm:p-7 ${tone === "warn" ? "bg-white ring-1 ring-warn/30" : "bg-white ring-1 ring-sand"}`}>
      <p className={`flex items-center gap-2 font-bold ${tone === "warn" ? "text-warn" : "text-brand-800"}`}>
        {icon} {title}
      </p>
      {facts.length ? (
        <ul className="mt-5 space-y-3.5">
          {facts.map((f) => (
            <li key={f.text} className="text-ink-2">
              <FactText fact={f} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-stone">A confirmar com a equipe.</p>
      )}
    </div>
  );
}

function OtherProducts({ current }: { current: string }) {
  const others = activeProducts.filter((x) => x.slug !== current);
  return (
    <nav aria-labelledby="outras-title" className="bg-paper py-16">
      <div className="container-x">
        <h2 id="outras-title" className="t-h3 text-brand-950">
          Outras modalidades
        </h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/${o.slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-sand-600 px-4 font-semibold text-brand-900 transition-colors hover:border-brand-800 hover:bg-white">
                {o.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/** Rotas condicionais: estrutura interna, sem jornada de contratação. */
function ConditionalProductPage({ product: p }: { product: Product }) {
  return (
    <section className="bg-paper py-[var(--section-y)]">
      <div className="container-x max-w-3xl">
        <p className="review-mark !text-[0.8rem]">Página interna — oferta não validada · noindex · fora do menu e do sitemap</p>
        <h1 className="t-h1 mt-6 text-brand-950">{p.name}</h1>
        <p className="t-lead mt-6 text-ink-2">{p.heroLead}</p>
        <ul className="mt-8 space-y-3">
          {[...p.forWhom, ...p.restrictions].map((f) => (
            <li key={f.text} className="text-ink-2">
              <FactText fact={f} />
            </li>
          ))}
        </ul>
        <p className="mt-8 text-ink-2">
          Se você recebe este benefício ou tem interesse nesta modalidade, fale com a equipe para receber orientação
          individual. <ReviewMark note="Validar oferta, elegibilidade e texto antes de publicar." />
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/contato" className="btn btn-brand">
            Falar com a equipe
          </Link>
          <WhatsAppCTA location={`conditional_${p.slug}`} product={p.slug} />
        </div>
        <p className="t-small mt-10 text-stone">
          Para aposentadoria ou pensão do INSS, veja{" "}
          <Link href={`/${products["consignado-inss"].slug}`} className="font-semibold text-brand-700 underline">
            Consignado INSS
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
