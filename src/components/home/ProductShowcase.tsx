import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { complementaryProducts, primaryProducts, type Product } from "@/content/products";

/** Card de modalidade — variação "feature" (escura) ou "standard" (clara). */
export function ProductCard({ product, index, feature = false, showSteps = false }: { product: Product; index: number; feature?: boolean; showSteps?: boolean }) {
  return (
    <Link
      href={`/${product.slug}`}
      data-cta={`product_card_${product.slug}`}
      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-[var(--radius-md)] p-6 transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-0.5 sm:p-8 ${
        feature
          ? "bg-navy-900 text-white hover:shadow-[0_30px_60px_-30px_rgb(8_20_40/0.6)]"
          : "border border-sand bg-white text-ink hover:border-sand-600 hover:shadow-[0_24px_50px_-32px_rgb(8_20_40/0.4)]"
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <span className={`t-num text-[0.8rem] font-bold ${feature ? "text-gold-300" : "text-navy-500"}`}>{String(index).padStart(2, "0")}</span>
          <ArrowUpRight
            aria-hidden
            className={`h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${feature ? "text-gold-400" : "text-navy-700"}`}
          />
        </div>
        <p className={`t-eyebrow mt-8 ${feature ? "text-navy-300" : "text-stone"}`}>{product.audience}</p>
        <h3 className={`t-h3 mt-2 ${feature ? "text-white" : "text-navy-950"}`}>{product.name}</h3>
        <p className={`mt-3 max-w-[42ch] ${feature ? "text-navy-100" : "text-ink-2"}`}>{product.mechanism}</p>
        {showSteps && product.steps.length > 0 && (
          <ol className={`mt-8 space-y-3 border-l pl-5 ${feature ? "border-white/15" : "border-sand"} ${feature ? "" : "lg:columns-2 lg:space-y-0 lg:[&>li]:mb-3"}`}>
            {product.steps.map((st, i) => (
              <li key={st.title} className="relative break-inside-avoid">
                <span aria-hidden className={`absolute -left-[23px] top-[0.55em] h-[5px] w-[5px] rounded-full ${feature ? "bg-gold-400" : "bg-navy-500"}`} />
                <span className={`t-num mr-2 text-[0.78rem] font-bold ${feature ? "text-navy-300" : "text-stone"}`}>{i + 1}</span>
                <span className={feature ? "text-white" : "text-ink"}>{st.title}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
      <span className={`mt-8 inline-flex items-center gap-2 font-bold ${feature ? "text-gold-300" : "text-navy-800"}`}>
        Entender a modalidade
        <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
      {feature && (
        <svg aria-hidden viewBox="0 0 200 200" className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 opacity-[0.14]">
          <path d="M150 30A85 85 0 1 0 150 170" fill="none" stroke="var(--color-gold-400)" strokeWidth="14" />
          <path d="M95 75h105M95 120h75M95 65v115" fill="none" stroke="var(--color-gold-400)" strokeWidth="14" />
        </svg>
      )}
    </Link>
  );
}

export function ProductShowcase() {
  const [lead, ...rest] = [
    primaryProducts.find((p) => p.slug === "consignado-inss")!,
    ...primaryProducts.filter((p) => p.slug !== "consignado-inss"),
  ];
  return (
    <section id="modalidades" aria-labelledby="modalidades-title" className="bg-paper py-[var(--section-y)]">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            id="modalidades-title"
            className="lg:col-span-7"
            eyebrow="Modalidades"
            title="Cada modalidade tem regras próprias. A gente explica todas."
          />
          <p className="t-lead text-ink-2 lg:col-span-5 lg:pb-2">
            Nenhuma taxa ou prazo é anunciado aqui: as condições dependem do seu perfil e da instituição parceira, e são
            apresentadas por escrito na proposta.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
          <div className="md:col-span-2 lg:col-span-1 lg:row-span-2">
            <ProductCard product={lead} index={1} feature showSteps />
          </div>
          {rest.map((p, i) => (
            <div key={p.slug} className={i === 2 ? "md:col-span-2 lg:col-span-2" : ""}>
              <ProductCard product={p} index={i + 2} showSteps={i === 2} />
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-6 border-t border-sand pt-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="t-eyebrow text-stone">Também disponíveis</p>
            <p className="mt-3 max-w-[32ch] text-ink-2">Alternativas que não dependem de desconto em folha ou no benefício.</p>
          </div>
          <ul className="divide-y divide-sand border-y border-sand lg:col-span-8">
            {complementaryProducts.map((p, i) => (
              <li key={p.slug}>
                <Link
                  href={`/${p.slug}`}
                  data-cta={`product_row_${p.slug}`}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-6 transition-colors hover:bg-paper-2 sm:px-4"
                >
                  <span className="t-num text-[0.8rem] font-bold text-navy-500">{String(primaryProducts.length + i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block text-[1.2rem] font-bold text-navy-950">{p.name}</span>
                    <span className="mt-1 block text-ink-2">{p.summary}</span>
                  </span>
                  <ArrowRight aria-hidden className="h-5 w-5 text-navy-700 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
