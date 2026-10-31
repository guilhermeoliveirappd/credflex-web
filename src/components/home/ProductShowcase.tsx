import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { activeProducts, type Product } from "@/content/products";

/** Card compacto: título, descrição curta e CTA. Detalhes ficam na página interna. */
export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/${product.slug}`}
      data-cta={`product_card_${product.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] border border-sand bg-white px-6 py-6 transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out)] hover:-translate-y-1 hover:border-brand-900/25 hover:shadow-[0_26px_50px_-30px_rgb(10_12_60/0.45)] sm:px-7"
    >
      <h3 className="t-h3 text-brand-950">{product.name}</h3>
      <p className="mt-1.5 line-clamp-2 text-ink-2">{product.teaser}</p>
      <span className="mt-auto inline-flex items-center gap-2 pt-5 font-bold text-brand-800">
        Entender a modalidade
        <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
      </span>
      {/* Barra de assinatura que cresce no hover */}
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-accent-400 transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-x-100" />
    </Link>
  );
}

export function ProductShowcase() {
  return (
    <section id="modalidades" aria-labelledby="modalidades-title" className="bg-paper py-[var(--section-y)]">
      <div className="container-x">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading id="modalidades-title" title="Modalidades de crédito" />
          <p className="text-ink-2 sm:pb-1.5">Taxas e prazos só depois da análise, sempre por escrito.</p>
        </div>
        <ul data-reveal="stagger" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeProducts.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
