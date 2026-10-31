import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ReviewMark } from "@/components/brand/ReviewMark";
import { LocationSection } from "@/components/home/LocationSection";
import { OfficialChannelNotice } from "@/components/ui/OfficialChannelNotice";
import { PageHero } from "@/components/ui/PageHero";
import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";
import { formatPhoneDisplay, site } from "@/content/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contato",
  description: "Fale com a CredFlex pelos canais oficiais ou visite o escritório em Osvaldo Cruz/SP.",
  path: "/contato",
});

export default function ContatoPage() {
  const { channels } = site;
  return (
    <>
      <PageHero crumb="Contato" path="/contato" title="Fale com uma pessoa da equipe." lead="Escolha o caminho mais confortável para você." />
      <section aria-label="Formas de contato" className="bg-paper pb-[var(--section-y)]">
        <div className="container-x grid gap-4 md:grid-cols-2">
          <div className="flex flex-col justify-between rounded-[var(--radius-md)] bg-brand-900 p-7 text-white sm:p-9">
            <div>
              <h2 className="t-h3">Comece pela pré-análise</h2>
              <p className="mt-3 text-brand-100">É a forma mais rápida: a equipe já recebe o contexto do seu caso e retorna com um protocolo.</p>
            </div>
            <Link href="/simulacao" className="btn btn-primary mt-8 self-start">Iniciar pré-análise <ArrowRight aria-hidden className="btn-arrow h-5 w-5" /></Link>
          </div>
          <div className="rounded-[var(--radius-md)] bg-white p-7 ring-1 ring-sand sm:p-9">
            <h2 className="t-h3 text-brand-950">Canais oficiais</h2>
            <ul className="mt-5 space-y-2 text-ink-2">
              {channels.whatsapp && <li>WhatsApp: <strong className="t-num text-brand-950">{formatPhoneDisplay(channels.whatsapp)}</strong></li>}
              {channels.phone && <li>Telefone: <strong className="t-num text-brand-950">{formatPhoneDisplay(channels.phone)}</strong></li>}
              {channels.email && <li>E-mail: <a href={`mailto:${channels.email}`} className="font-semibold text-brand-800 underline">{channels.email}</a></li>}
              {!channels.whatsapp && !channels.phone && !channels.email && (
                <li><ReviewMark note="Bloqueante: confirmar canais oficiais." /> Canais em confirmação.</li>
              )}
            </ul>
            <div className="mt-8"><WhatsAppCTA location="contact_page" label="Conversar no WhatsApp" variant="brand" /></div>
          </div>
        </div>
        <div className="container-x mt-6"><OfficialChannelNotice /></div>
      </section>
      <LocationSection />
    </>
  );
}
