import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { PhotoSlot } from "@/components/brand/PhotoSlot";
import { ReviewMark } from "@/components/brand/ReviewMark";
import { milestones } from "@/content/institutional";
import { photos } from "@/content/photos";
import { showReviewMarkers, site } from "@/content/site";

export function InstitutionalTimeline({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const items = milestones.filter((m) => m.status === "confirmed" || showReviewMarkers);
  if (items.length === 0) return null;
  return (
    <ol className={`relative border-l pl-8 ${tone === "light" ? "border-white/20" : "border-sand-600"}`}>
      {items.map((m) => (
        <li key={m.year + m.title} className="relative pb-8 last:pb-0">
          <span aria-hidden className={`absolute -left-[37px] top-1.5 h-[9px] w-[9px] rounded-full border-2 ${tone === "light" ? "border-accent-400 bg-brand-900" : "border-brand-700 bg-white"}`} />
          <p className={`t-num font-[family-name:var(--font-display)] text-2xl font-semibold ${tone === "light" ? "text-accent-300" : "text-brand-700"}`}>
            {m.year}
          </p>
          <p className={`mt-1 font-bold ${tone === "light" ? "text-white" : "text-brand-950"}`}>
            {m.title} <ReviewMark status={m.status} note={m.note} />
          </p>
          {m.text && <p className={`mt-1 ${tone === "light" ? "text-brand-100" : "text-ink-2"}`}>{m.text}</p>}
        </li>
      ))}
    </ol>
  );
}

export function TrustSection() {
  const { location } = site;
  return (
    <section aria-labelledby="confianca-title" className="noise bg-brand-900 py-[var(--section-y)] text-white">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 id="confianca-title" data-reveal="title" className="t-h2 text-white lg:col-span-6">
            Uma equipe que você conhece pelo nome.
          </h2>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="text-[1.08rem] leading-relaxed text-brand-100">
              Somos de {location.city}, no interior de São Paulo. Você conversa com a gente pessoalmente ou pelo WhatsApp.
            </p>
            <Link href="/quem-somos" className="link-arrow mt-4 text-accent-300">
              Conheça a nossa história
            </Link>
          </div>
        </div>

        {/* Mosaico compacto: fachada em destaque + blocos com informação real */}
        <div data-reveal="stagger" className="mt-12 grid grid-cols-6 gap-3 sm:gap-4 lg:h-[400px] lg:grid-cols-12 lg:grid-rows-2">
          <PhotoSlot
            src={photos.fachada.src ?? undefined}
            alt={photos.fachada.alt}
            brief={photos.fachada.brief}
            focus={photos.fachada.focus}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="col-span-6 aspect-[16/10] rounded-[var(--radius-md)] lg:row-span-2 lg:aspect-auto lg:h-full"
            tone="navy"
          />
          <div className="col-span-3 flex min-h-[170px] flex-col justify-between rounded-[var(--radius-md)] bg-accent-400 p-5 text-brand-950 sm:p-6">
            <span className="fbars fbars-brand" aria-hidden />
            <p className="font-[family-name:var(--font-display)] text-[1.2rem] font-semibold leading-tight sm:text-[1.45rem]">
              Atendimento humano, do primeiro contato à proposta.
            </p>
          </div>
          <div className="col-span-3 flex min-h-[170px] flex-col justify-between rounded-[var(--radius-md)] bg-brand-800 p-5 sm:p-6">
            <p className="text-[0.95rem] text-brand-100">Em atividade desde</p>
            <p className="t-num font-[family-name:var(--font-display)] text-[3rem] font-semibold leading-none text-accent-400 sm:text-[3.6rem]">
              {site.history.foundedYear} <ReviewMark note={site.history.note} />
            </p>
          </div>
          <PhotoSlot
            src={photos.atendimento.src ?? undefined}
            alt={photos.atendimento.alt}
            brief={photos.atendimento.brief}
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="col-span-3 aspect-square rounded-[var(--radius-md)] lg:aspect-auto lg:h-full"
            tone="gold"
          />
          <a
            href={location.mapsUrl ?? "/contato"}
            target={location.mapsUrl ? "_blank" : undefined}
            rel={location.mapsUrl ? "noopener noreferrer" : undefined}
            className="group col-span-3 flex flex-col justify-between rounded-[var(--radius-md)] bg-white p-5 text-brand-950 transition-colors hover:bg-brand-100 sm:p-6"
          >
            <MapPin aria-hidden className="h-6 w-6 text-brand-700" />
            <span>
              <span className="block font-bold leading-snug">{location.street}</span>
              <span className="block text-[0.95rem] text-ink-2">
                {location.district} · {location.city}/{location.state}
              </span>
              <span className="mt-2 inline-flex items-center gap-1 text-[0.92rem] font-semibold text-brand-800 group-hover:underline">
                Como chegar <ArrowUpRight aria-hidden className="h-4 w-4" />
              </span>
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}
