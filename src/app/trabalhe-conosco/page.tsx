import type { Metadata } from "next";
import { CareersForm } from "@/components/careers/CareersForm";
import { PageHero } from "@/components/ui/PageHero";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Trabalhe conosco",
  description: "Quer fazer parte da equipe da CredFlex em Osvaldo Cruz/SP? Envie seu currículo.",
  path: "/trabalhe-conosco",
});

export default function Page() {
  return (
    <>
      <PageHero crumb="Trabalhe conosco" path="/trabalhe-conosco" title="Venha atender gente de verdade." lead="Procuramos pessoas que gostam de explicar com paciência e tratar cada cliente com respeito." />
      <section className="bg-paper pb-[var(--section-y)]">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="t-h3 text-brand-950">Como funciona</h2>
            <p className="mt-3 text-ink-2">Envie seu currículo em PDF. Ele será usado somente em processos seletivos da CredFlex e não é compartilhado com terceiros.</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6"><CareersForm /></div>
        </div>
      </section>
    </>
  );
}
