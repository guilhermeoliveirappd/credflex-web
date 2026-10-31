import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProfileGlyph } from "@/components/ui/ProfileGlyph";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { activeProducts, type Product, type ProductSlug } from "@/content/products";

const glyph: Partial<Record<ProductSlug, Parameters<typeof ProfileGlyph>[0]["icon"]>> = {
  "consignado-clt": "clt",
  "consignado-inss": "inss",
  "portabilidade-inss": "portabilidade",
  "servidor-publico": "servidor",
  "antecipacao-fgts": "fgts",
  "emprestimo-conta-de-luz": "luz",
};

/** Card compacto: ícone, título, descrição curta e CTA. Detalhes ficam na página interna. */
export function ProductCard({ product, index }: { product: Product; index: number }) {
  const icon = glyph[product.slug];
  return (
    <Link
      href={`/${product.slug}`}
      data-cta={`product_card_${product.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] border border-sand bg-white p-6 transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out)] hover:-translate-y-1 hover:border-brand-900/25 hover:shadow-[0_26px_50px_-30px_rgb(10_12_60/0.45)] sm:p-7"
    >
      <div className="flex items-center justify-between">
        {icon && (
          <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] bg-accent-400 text-brand-950 transition-colors duration-300 group-hover:bg-brand-900 group-hover:text-accent-400">
            <ProfileGlyph icon={icon} className="h-5 w-5" />
          </span>
        )}
        <span aria-hidden className="t-num text-[0.8rem] font-bold text-brand-500">
          {String(index).padStart(2, "0")}
        </span>
      </div>
      <h3 className="t-h3 mt-6 text-brand-950">{product.name}</h3>
      <p className="no-justify mt-2 line-clamp-2 text-ink-2">{product.teaser}</p>
      <span className="mt-auto inline-flex items-center gap-2 pt-6 font-bold text-brand-800">
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
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <SectionHeading id="modalidades-title" className="lg:col-span-7" title="Cada modalidade tem regras próprias. A gente explica todas." />
          <p className="text-[1.05rem] leading-relaxed text-ink-2 lg:col-span-5 lg:pb-2">
            Nenhuma taxa ou prazo é anunciado aqui: as condições dependem do seu perfil e da instituição parceira, e são
            apresentadas por escrito na proposta.
          </p>
        </div>
        <ul data-reveal="stagger" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeProducts.map((p, i) => (
            <li key={p.slug}>
              <ProductCard product={p} index={i + 1} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
