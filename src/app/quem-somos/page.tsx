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
        eyebrow="Quem somos"
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
      <section aria-labelledby="historia-title" className="bg-paper-2 py-[var(--section-y)]">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <PhotoSlot
              alt="Fundador(a) e equipe da CredFlex"
              brief="Foto histórica ou atual da fundação/equipe, com autorização. Horizontal."
              className="aspect-[4/3] rounded-[var(--radius-md)] rounded-bl-[35%]"
            />
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <SectionHeading id="historia-title" eyebrow="Trajetória" title="Nossa história" />
            <p className="mt-6 text-ink-2">
              O texto da história institucional será escrito com a CredFlex a partir de informações confirmadas: fundação,
              pessoas, marcos e modalidades. <ReviewMark note="Aguardando entrevista/briefing institucional." />
            </p>
            <div className="mt-10">
              <InstitutionalTimeline />
            </div>
          </div>
        </div>
      </section>
      <section aria-labelledby="principios-title" className="bg-paper py-[var(--section-y)]">
        <div className="container-x">
          <SectionHeading id="principios-title" eyebrow="Como trabalhamos" title="Três compromissos que orientam o atendimento." className="max-w-3xl" />
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {principles.map(([t, d], i) => (
              <li key={t} className="border-t-2 border-navy-900 pt-6">
                <span className="t-num text-[0.85rem] font-bold text-navy-500">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="t-h3 mt-3 text-navy-950">{t}</h3>
                <p className="mt-3 text-ink-2">{d}</p>
              </li>
            ))}
          </ol>
          <p className="t-small mt-6 text-stone">
            <ReviewMark note="Compromissos propostos; validar com a direção da CredFlex." />
          </p>
          <div className="mt-16 rounded-[var(--radius-md)] bg-white p-7 ring-1 ring-sand sm:p-9">
            <h2 className="t-h3 text-navy-950">O papel de correspondente bancário</h2>
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
