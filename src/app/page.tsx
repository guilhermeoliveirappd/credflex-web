import type { Metadata } from "next";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { LocationSection } from "@/components/home/LocationSection";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { ProfileSelector } from "@/components/home/ProfileSelector";
import { TransparencyBlock } from "@/components/home/TransparencyBlock";
import { TrustSection } from "@/components/home/TrustSection";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { homeFaq } from "@/content/institutional";
import { pageMetadata } from "@/lib/seo/metadata";
import Link from "next/link";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "CredFlex — crédito com gente de verdade por trás",
    description:
      "Correspondente bancário em Osvaldo Cruz/SP. Descubra a modalidade certa para o seu perfil — CLT, INSS, portabilidade, servidor público, FGTS ou conta de luz — com atendimento humano.",
    path: "/",
  }),
  title: { absolute: "CredFlex — crédito com gente de verdade por trás" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProfileSelector />
      <ProductShowcase />
      <TrustSection />
      <HowItWorks />
      <TransparencyBlock />
      <LocationSection />
      <section aria-labelledby="faq-title" className="bg-paper py-[var(--section-y)]">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="faq-title" eyebrow="Dúvidas frequentes" title="Perguntas que todo mundo deveria fazer." />
            <Link href="/ajuda" className="link-arrow mt-8 text-navy-800">
              Ver central de ajuda
            </Link>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <FAQAccordion items={homeFaq} />
          </div>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
