import Link from "next/link";
import { PhotoSlot } from "@/components/brand/PhotoSlot";
import { ReviewMark } from "@/components/brand/ReviewMark";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { milestones } from "@/content/institutional";
import { showReviewMarkers, site } from "@/content/site";

export function InstitutionalTimeline({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const items = milestones.filter((m) => m.status === "confirmed" || showReviewMarkers);
  if (items.length === 0) return null;
  return (
    <ol className="relative border-l border-sand-600 pl-8">
      {items.map((m) => (
        <li key={m.year + m.title} className="relative pb-8 last:pb-0">
          <span aria-hidden className="absolute -left-[37px] top-1.5 h-[9px] w-[9px] rounded-full border-2 border-gold-500 bg-paper" />
          <p className={`t-num font-[family-name:var(--font-display)] text-2xl font-semibold ${tone === "light" ? "text-gold-300" : "text-navy-700"}`}>
            {m.year}
          </p>
          <p className={`mt-1 font-bold ${tone === "light" ? "text-white" : "text-navy-950"}`}>
            {m.title} <ReviewMark status={m.status} note={m.note} />
          </p>
          {m.text && <p className={`mt-1 ${tone === "light" ? "text-navy-100" : "text-ink-2"}`}>{m.text}</p>}
        </li>
      ))}
    </ol>
  );
}

export function TrustSection() {
  return (
    <section aria-labelledby="confianca-title" className="bg-paper-2 py-[var(--section-y)]">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Eyebrow>Quem está por trás</Eyebrow>
            <h2 id="confianca-title" className="t-h2 mt-5 text-navy-950">
              Crédito com gente de verdade por trás.
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 lg:pt-14">
            <p className="t-lead text-ink-2">
              A CredFlex é uma empresa de {site.location.city}, no interior de São Paulo
              {site.history.foundedYear ? `, com atividades desde ${site.history.foundedYear}` : ""}.{" "}
              <ReviewMark note={site.history.note} /> Quem atende você tem nome, rosto e endereço — e responde pelo que
              explica.
            </p>
            <Link href="/quem-somos" className="link-arrow mt-6 text-navy-800">
              Conheça a nossa história
            </Link>
          </div>
        </div>

        {/* Mosaico editorial: escalas diferentes, nunca três cards iguais */}
        <div className="mt-14 grid grid-cols-6 gap-3 sm:gap-4 lg:h-[640px] lg:grid-cols-12 lg:grid-rows-[3fr_2fr]">
          <PhotoSlot
            alt="Equipe CredFlex reunida no escritório"
            brief="Foto de equipe real, horizontal 3:2, com autorização de uso de imagem de cada pessoa."
            className="col-span-6 aspect-[3/2] rounded-[var(--radius-md)] lg:col-span-7 lg:row-span-2 lg:aspect-auto lg:h-full"
            tone="navy"
          />
          <PhotoSlot
            alt="Porta-voz da CredFlex"
            brief="Retrato do(a) porta-voz/fundador(a), vertical 4:5."
            className="col-span-3 aspect-[4/5] rounded-[var(--radius-md)] lg:col-span-3 lg:aspect-auto lg:h-full"
            tone="sand"
          />
          <div className="col-span-3 flex flex-col justify-between rounded-[var(--radius-md)] bg-navy-900 p-5 text-white sm:p-6 lg:col-span-2">
            <span className="fbars" aria-hidden />
            <p className="font-[family-name:var(--font-display)] text-[1.35rem] font-semibold leading-tight sm:text-2xl">
              Atendimento humano, do primeiro contato à proposta.
            </p>
          </div>
          <PhotoSlot
            alt="Detalhe do atendimento no escritório da CredFlex"
            brief="Detalhe do ambiente de atendimento (mesa, recepção), horizontal."
            className="col-span-6 aspect-[16/9] rounded-[var(--radius-md)] lg:col-span-5 lg:aspect-auto lg:h-full"
            tone="sand"
          />
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="t-eyebrow text-stone">Trajetória</p>
            <p className="mt-3 max-w-[30ch] text-ink-2">Os marcos abaixo serão publicados somente após confirmação da CredFlex.</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <InstitutionalTimeline />
          </div>
        </div>
      </div>
    </section>
  );
}
