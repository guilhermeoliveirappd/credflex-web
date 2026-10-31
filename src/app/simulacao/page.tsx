import type { Metadata } from "next";
import { Lock, UserRound } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { OfficialChannelNotice } from "@/components/ui/OfficialChannelNotice";
import { CreditPrequalificationWizard } from "@/components/wizard/CreditPrequalificationWizard";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Pré-análise de crédito",
  description:
    "Responda poucas perguntas sobre o seu perfil e receba orientação humana da CredFlex sobre as modalidades possíveis. Sem compromisso e sem CPF nesta etapa.",
  path: "/simulacao",
});

export default async function SimulacaoPage({ searchParams }: { searchParams: Promise<{ modalidade?: string }> }) {
  const { modalidade } = await searchParams;
  return (
    <div className="bg-paper">
      <div className="container-x grid gap-10 pb-[var(--section-y)] pt-8 lg:grid-cols-12 lg:gap-12 lg:pt-12">
        <aside className="lg:col-span-4 lg:pt-4">
          <Breadcrumbs items={[{ name: "Pré-análise", path: "/simulacao" }]} />
          <div className="mt-8">
            <h1 className="t-h2 text-brand-950">Vamos entender o seu caso.</h1>
            <p className="t-lead mt-5 text-ink-2">
              Poucas perguntas, sem documentos. No fim, uma pessoa da equipe retorna com as possibilidades e os próximos
              passos.
            </p>
          </div>
          <ul className="mt-8 hidden space-y-5 border-t border-sand pt-8 lg:block">
            <li className="flex gap-3">
              <UserRound aria-hidden className="mt-0.5 h-5 w-5 flex-none text-brand-700" />
              <span className="text-ink-2">
                <strong className="text-brand-950">Isto não é uma simulação de parcelas.</strong> Taxas e valores só existem
                depois da análise da instituição parceira — e chegam a você por escrito.
              </span>
            </li>
            <li className="flex gap-3">
              <Lock aria-hidden className="mt-0.5 h-5 w-5 flex-none text-brand-700" />
              <span className="text-ink-2">
                Suas respostas ficam guardadas apenas neste navegador até o envio. Nome e WhatsApp não são salvos no
                rascunho.
              </span>
            </li>
          </ul>
          <OfficialChannelNotice className="mt-8 hidden lg:flex" />
        </aside>
        <div className="lg:col-span-8">
          <CreditPrequalificationWizard initialProduct={modalidade} />
          <OfficialChannelNotice className="mt-6 lg:hidden" />
        </div>
      </div>
    </div>
  );
}
