import type { ReactNode } from "react";
import { FileWarning } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";

/**
 * Documento legal em RASCUNHO. O aviso é sempre exibido (inclusive em
 * produção) até que o jurídico aprove e remova `draft`.
 */
export function LegalDocument({
  title,
  path,
  crumb,
  draft = true,
  sections,
  children,
}: {
  title: string;
  path: string;
  crumb: string;
  draft?: boolean;
  sections: { id: string; title: string; body: ReactNode }[];
  children?: ReactNode;
}) {
  return (
    <>
      <PageHero tone="navy" title={title} path={path} crumb={crumb} />
      <section className="bg-paper pb-[var(--section-y)]">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <nav aria-label="Índice" className="lg:col-span-3">
            <ol className="space-y-1 text-[0.95rem] lg:sticky lg:top-[calc(var(--header-h)+32px)]">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="flex min-h-10 items-center gap-2 text-ink-2 hover:text-brand-800 hover:underline">
                    <span className="t-num text-stone">{i + 1}.</span> {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <article className="max-w-[72ch] lg:col-span-8 lg:col-start-5">
            {draft && (
              <div role="note" className="mb-10 flex gap-3 rounded-[var(--radius-md)] border border-warn/40 bg-warn-bg p-5">
                <FileWarning aria-hidden className="mt-0.5 h-5 w-5 flex-none text-warn" />
                <p className="text-ink-2">
                  <strong className="text-brand-950">Rascunho em revisão jurídica.</strong> Este texto é uma estrutura preliminar
                  e não foi aprovado. Campos entre colchetes dependem de informações oficiais da CredFlex.
                </p>
              </div>
            )}
            {children}
            <div className="space-y-12">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-[calc(var(--header-h)+24px)]">
                  <h2 id={`${s.id}-h`} className="t-h3 text-brand-950">
                    <span className="t-num mr-2 text-brand-500">{i + 1}.</span>
                    {s.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-ink-2 [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">{s.body}</div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
