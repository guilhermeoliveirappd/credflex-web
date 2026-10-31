import type { Metadata } from "next";
import { Ban, KeyRound, MessageCircleWarning, PhoneCall, ShieldCheck, UserCheck } from "lucide-react";
import { ReviewMark } from "@/components/brand/ReviewMark";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatPhoneDisplay, site } from "@/content/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Segurança e canais oficiais",
  description: "Saiba como reconhecer os canais oficiais da CredFlex e se proteger de golpes. A CredFlex não solicita depósitos antecipados.",
  path: "/seguranca",
});

const never = [
  { icon: Ban, t: "Depósito, taxa ou pagamento antecipado", d: "Nenhum crédito legítimo exige que você pague antes para liberar o valor." },
  { icon: KeyRound, t: "Senhas, tokens ou códigos de SMS", d: "Não pedimos senha de banco, do INSS (Meu INSS) ou códigos de verificação." },
  { icon: MessageCircleWarning, t: "Pressa ou ameaça", d: "“Só hoje”, “seu benefício será bloqueado”: pressão é sinal de golpe." },
];

const doThis = [
  { icon: UserCheck, t: "Confira o canal", d: "Compare o número ou perfil com os canais oficiais listados nesta página." },
  { icon: PhoneCall, t: "Na dúvida, desligue e ligue você", d: "Encerre a conversa e entre em contato pelos canais oficiais." },
  { icon: ShieldCheck, t: "Peça tudo por escrito", d: "Proposta com taxa, CET e nome da instituição antes de assinar." },
];

export default function SegurancaPage() {
  const { channels } = site;
  const list = [
    channels.whatsapp && ["WhatsApp", formatPhoneDisplay(channels.whatsapp)],
    channels.phone && ["Telefone", formatPhoneDisplay(channels.phone)],
    channels.email && ["E-mail", channels.email],
    channels.instagram && ["Instagram", channels.instagram],
  ].filter(Boolean) as [string, string][];
  return (
    <>
      <PageHero tone="navy" crumb="Segurança" path="/seguranca" title={site.antiFraudMessage} lead="Golpes com falsas ofertas de crédito são comuns. Estas orientações ajudam você a reconhecer o contato legítimo." />
      <section aria-labelledby="nunca-title" className="bg-paper py-[var(--section-y)]">
        <div className="container-x grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading id="nunca-title" title="Se pedirem isto, não é a gente." />
            <ul className="mt-10 space-y-6">
              {never.map(({ icon: I, t, d }) => (
                <li key={t} className="flex gap-4">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[var(--radius-sm)] bg-error-bg text-error"><I aria-hidden className="h-5 w-5" /></span>
                  <span><span className="block font-bold text-brand-950">{t}</span><span className="text-ink-2">{d}</span></span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading title="Três hábitos que protegem você." />
            <ul className="mt-10 space-y-6">
              {doThis.map(({ icon: I, t, d }) => (
                <li key={t} className="flex gap-4">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[var(--radius-sm)] bg-ok-bg text-ok"><I aria-hidden className="h-5 w-5" /></span>
                  <span><span className="block font-bold text-brand-950">{t}</span><span className="text-ink-2">{d}</span></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section id="canais" aria-labelledby="canais-title" className="bg-accent-400 py-[var(--section-y)] text-brand-950">
        <div className="container-x max-w-4xl">
          <SectionHeading id="canais-title" title="Estes são os únicos canais da CredFlex." />
          {list.length ? (
            <dl className="mt-10 divide-y divide-brand-900/25 border-y border-brand-900/25">
              {list.map(([k, v]) => (
                <div key={k} className="grid gap-1 py-5 sm:grid-cols-[12rem_1fr]">
                  <dt className="t-small font-semibold text-brand-950">{k}</dt>
                  <dd className="t-num text-xl font-bold text-brand-950">{v}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-10 rounded-[var(--radius-md)] border border-dashed border-sand-600 bg-white p-6 text-ink-2">
              <ReviewMark note="Bloqueante para publicação: o site antigo exibia números diferentes; definir canais oficiais únicos." /> A lista de canais oficiais será publicada após confirmação.
            </p>
          )}
          <p className="mt-8 text-brand-950">
            Se você recebeu um contato suspeito em nome da CredFlex, não forneça dados e avise a nossa equipe pelos canais
            acima. Em caso de golpe, registre boletim de ocorrência e comunique o seu banco.
          </p>
        </div>
      </section>
    </>
  );
}
