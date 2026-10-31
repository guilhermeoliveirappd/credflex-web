import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ContactCard } from "@/components/home/LocationSection";
import { OfficialChannelNotice } from "@/components/ui/OfficialChannelNotice";
import { PageHero } from "@/components/ui/PageHero";
import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contato",
  description: `Fale com a CredFlex pelo WhatsApp ou e-mail, ou visite o escritório na ${site.location.street}, ${site.location.district}, ${site.location.city}/${site.location.state}.`,
  path: "/contato",
});

export default function ContatoPage() {
  return (
    <>
      <PageHero crumb="Contato" path="/contato" title="Fale com uma pessoa da equipe." lead="Escolha o caminho mais confortável para você: WhatsApp, e-mail ou uma visita ao nosso escritório no centro de Osvaldo Cruz." />
      <section aria-label="Formas de contato" className="bg-paper py-[var(--section-y)]">
        <div className="container-x grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <h2 className="t-h3 mb-6 text-brand-950">Canais oficiais</h2>
            <ContactCard tone="light" />
            <p className="mt-5 text-ink-2">
              Estes são os únicos canais da CredFlex. Se receber contato por outro número ou perfil em nosso nome, não
              forneça dados e confirme com a equipe por aqui.
            </p>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="flex flex-col justify-between rounded-[var(--radius-md)] bg-brand-900 p-8 text-white sm:p-10">
              <div>
                <h2 className="t-h3">Quer conhecer as opções de crédito?</h2>
                <p className="mt-3 text-brand-100">
                  Comece pela pré-análise: a equipe já recebe o contexto do seu caso e retorna com um protocolo de
                  atendimento.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3">
                <Link href="/simulacao" className="btn btn-primary">
                  Iniciar pré-análise <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                </Link>
                <WhatsAppCTA location="contact_page" label="Conversar no WhatsApp" className="text-white" />
              </div>
            </div>
            <OfficialChannelNotice />
          </div>
        </div>
      </section>
    </>
  );
}
