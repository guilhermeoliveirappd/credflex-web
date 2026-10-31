import Link from "next/link";
import { CFPath } from "@/components/brand/CFPath";
import { activeProducts } from "@/content/products";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-accent-400 py-[var(--section-y)]">
      <CFPath className="pointer-events-none absolute -right-[15%] top-0 hidden h-full w-[60%] opacity-60 md:block" stroke="var(--color-brand-900)" />
      <div className="container-x relative max-w-3xl">
        <h1 className="t-h1 text-brand-950">Este caminho não existe. Mas a gente ajuda a achar o certo.</h1>
        <p className="t-lead mt-6 text-brand-950">A página pode ter mudado de endereço. Escolha uma das opções abaixo.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-brand">Ir para o início</Link>
          <Link href="/simulacao" className="btn btn-ghost text-brand-950">Iniciar pré-análise</Link>
        </div>
        <ul className="mt-12 grid gap-x-6 gap-y-1 border-t border-brand-900/25 pt-6 sm:grid-cols-2">
          {activeProducts.map((p) => (
            <li key={p.slug}><Link href={`/${p.slug}`} className="flex min-h-11 items-center font-semibold text-brand-800 hover:underline">{p.name}</Link></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
