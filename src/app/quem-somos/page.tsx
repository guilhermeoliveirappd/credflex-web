import type { Metadata } from "next";
import { PhotoSlot } from "@/components/brand/PhotoSlot";
import { ReviewMark } from "@/components/brand/ReviewMark";
import { FinalCTA } from "@/components/home/FinalCTA";
import { HowItWorks } from "@/components/home/HowItWorks";
import { LocationSection } from "@/components/home/LocationSection";
import { InstitutionalTimeline } from "@/components/home/TrustSection";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { roleFacts, site } from "@/content/site";
import { FactText } from "@/components/brand/ReviewMark";
import { pageMetadata } from "@/lib/seo/metadata";
import { photos } from "@/content/photos";

export const metadata: Metadata = pageMetadata({
  title: "Quem somos",
  description: "Conheça a CredFlex: correspondente bancário em Osvaldo Cruz/SP, com equipe e atendimento humano.",
  path: "/quem-somos",
});

const principles = [
  ["Explicar antes de oferecer", "Ninguém deveria contratar crédito sem entender como ele funciona. Começamos pela explicação."],
  ["Números por escrito", "Taxa, CET e parcelas sempre por escrito, antes de qualquer decisão."],
  ["Dizer não quando for o caso", "Se uma modalidade não faz sentido para você, a gente fala."],
];

export default function QuemSomosPage() {
  return (
    <>
      <PageHero
        crumb="Quem somos"
        path="/quem-somos"
        title="Uma empresa do interior paulista, com gente de verdade atendendo."
        lead={
          <>
            A CredFlex nasceu em {site.location.city}/{site.location.state}
            {site.history.foundedYear ? ` em ${site.history.foundedYear}` : ""}. <ReviewMark note={site.history.note} /> Hoje ajuda pessoas
            a entender e acessar modalidades de crédito com atendimento próximo.
          </>
        }
      />
      <section aria-labelledby="historia-title" className="bg-white py-[var(--section-y)]">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <PhotoSlot
              src={photos.fachada.src ?? undefined}
              alt={photos.fachada.alt}
              brief={photos.fachada.brief}
              focus={photos.fachada.focus}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="aspect-[4/3] rounded-[var(--radius-md)] rounded-bl-[35%]"
            />
            <p className="mt-4 flex items-center gap-2 text-[0.95rem] text-ink-2">
              <span className="fbars fbars-brand" aria-hidden />
              Nosso escritório: {site.location.street}, {site.location.district}, {site.location.city}/{site.location.state}
            </p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <SectionHeading id="historia-title" title="Nossa história" />
            <p className="support-text mt-6 text-ink-2">
              O texto da história institucional será escrito com a CredFlex a partir de informações confirmadas: fundação,
              pessoas, marcos e modalidades. <ReviewMark note="Aguardando entrevista/briefing institucional." />
            </p>
            <div className="mt-10">
              <InstitutionalTimeline />
            </div>
          </div>
        </div>
      </section>
      <section aria-labelledby="principios-title" className="noise bg-brand-900 py-[var(--section-y)] text-white">
        <div className="container-x">
          <SectionHeading id="principios-title" tone="light" title="Três compromissos que orientam o atendimento." className="max-w-3xl" />
          <ol data-reveal="stagger" className="mt-12 grid gap-4 md:grid-cols-3">
            {principles.map(([t, d], i) => (
              <li key={t} className="border-t-2 border-accent-400 pt-6">
                <span className="t-num text-[0.85rem] font-bold text-accent-300">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="t-h3 mt-3 text-white">{t}</h3>
                <p className="mt-3 text-brand-100">{d}</p>
              </li>
            ))}
          </ol>
          <p className="t-small mt-6 text-brand-100">
            <ReviewMark note="Compromissos propostos; validar com a direção da CredFlex." />
          </p>
          <div className="mt-16 rounded-[var(--radius-md)] bg-white p-7 ring-1 ring-sand sm:p-9">
            <h2 className="t-h3 text-brand-950">O papel de correspondente bancário</h2>
            <ul className="mt-5 space-y-3 text-ink-2">
              {roleFacts.map((f) => (
                <li key={f.text}>
                  <FactText fact={f} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <HowItWorks />
      <LocationSection />
      <FinalCTA />
    </>
  );
}
