import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, MessageCircle } from "lucide-react";
import { ReviewMark } from "@/components/brand/ReviewMark";
import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";
import { LocationMap } from "./LocationMap";
import { formatPhoneDisplay, site } from "@/content/site";

/** Bloco institucional de endereço e canais oficiais (dados em content/site.ts). */
export function ContactCard({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const { location, channels } = site;
  const dark = tone === "dark";
  const muted = dark ? "text-brand-300" : "text-stone";
  const link = dark ? "text-accent-300" : "text-brand-800";
  const rows = [
    {
      icon: MapPin,
      label: "Endereço",
      body: (
        <>
          <span className="block">
            {location.street}, {location.district}
          </span>
          <span className="block">
            {location.city} – {location.state} · CEP {location.postalCode}
          </span>
          {location.mapsUrl && (
            <a href={location.mapsUrl} target="_blank" rel="noopener noreferrer" className={`mt-1.5 inline-flex items-center gap-1 text-[0.95rem] font-semibold ${link} hover:underline`}>
              Ver no mapa <ArrowUpRight aria-hidden className="h-4 w-4" />
            </a>
          )}
        </>
      ),
    },
    (channels.whatsapp || channels.phone) && {
      icon: MessageCircle,
      label: "Telefone / WhatsApp",
      body: (
        <>
          {channels.whatsapp && (
            <a href={`https://wa.me/${channels.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="t-num block hover:underline">
              {formatPhoneDisplay(channels.whatsapp)} <span className={`text-[0.9rem] font-normal ${muted}`}>WhatsApp</span>
            </a>
          )}
          {channels.phone ? (
            <a href={`tel:+${channels.phone.replace(/\D/g, "")}`} className="t-num block hover:underline">
              {formatPhoneDisplay(channels.phone)} <span className={`text-[0.9rem] font-normal ${muted}`}>fixo</span>
            </a>
          ) : (
            <ReviewMark note="Telefone fixo recebido incompleto: (18) 3529-2…. Confirmar número completo." />
          )}
        </>
      ),
    },
    channels.email && {
      icon: Mail,
      label: "E-mail",
      body: (
        <a href={`mailto:${channels.email}`} className="whitespace-nowrap hover:underline">
          {channels.email}
        </a>
      ),
    },
  ].filter((r): r is Exclude<typeof r, "" | null | false | undefined> => !!r);

  return (
    <div className={`rounded-[var(--radius-md)] p-6 sm:p-9 ${dark ? "noise border border-white/10 bg-brand-900" : "bg-white ring-1 ring-sand"} ${className}`}>
      <dl className={`divide-y ${dark ? "divide-white/10" : "divide-sand"}`}>
        {rows.map(({ icon: Icon, label, body }) => (
          <div key={label} className="grid grid-cols-[2.75rem_1fr] gap-x-4 py-5 first:pt-0 last:pb-0">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-400 text-brand-950">
              <Icon aria-hidden className="h-5 w-5" strokeWidth={2} />
            </span>
            <div>
              <dt className={`text-[0.85rem] font-semibold uppercase tracking-[0.08em] ${muted}`}>{label}</dt>
              <dd className={`mt-1 text-[1.08rem] font-semibold leading-snug ${dark ? "text-white" : "text-brand-950"}`}>{body}</dd>
            </div>
          </div>
        ))}
      </dl>
      {location.openingHours ? (
        <p className={`mt-6 border-t pt-5 ${dark ? "border-white/10 text-brand-100" : "border-sand text-ink-2"}`}>{location.openingHours}</p>
      ) : (
        <p className={`mt-6 border-t pt-5 text-[0.95rem] ${dark ? "border-white/10" : "border-sand"} ${muted}`}>
          <ReviewMark note={location.note} /> Horário de atendimento a confirmar.
        </p>
      )}
    </div>
  );
}

export function LocationSection() {
  const { location, channels } = site;
  const wa = channels.whatsapp?.replace(/\D/g, "");
  return (
    <section aria-labelledby="local-title" className="noise overflow-hidden bg-brand-950 py-[var(--section-y)] text-white">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="flex flex-col lg:col-span-5">
          <h2 id="local-title" data-reveal="title" className="t-h1 text-white">
            {location.city},
            <br />
            <span className="text-accent-400">São Paulo.</span>
          </h2>
          <p className="t-lead mt-6 max-w-[34ch] text-brand-100">Atendemos no centro da cidade. Venha conversar com a equipe.</p>
          <dl data-reveal="stagger" className="mt-8 space-y-4 border-t border-white/12 pt-7">
            <div className="flex gap-4">
              <dt className="sr-only">Endereço</dt>
              <MapPin aria-hidden className="mt-1 h-5 w-5 flex-none text-accent-400" />
              <dd className="text-[1.02rem] leading-relaxed">
                {location.street}, {location.district}
                <br />
                <span className="text-brand-300">
                  {location.city} – {location.state} · CEP {location.postalCode}
                </span>
              </dd>
            </div>
            {wa && (
              <div className="flex gap-4">
                <dt className="sr-only">Telefone e WhatsApp</dt>
                <MessageCircle aria-hidden className="mt-1 h-5 w-5 flex-none text-accent-400" />
                <dd>
                  <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="t-num text-[1.02rem] font-semibold underline-offset-4 hover:text-accent-300 hover:underline">
                    {formatPhoneDisplay(channels.whatsapp!)}
                  </a>{" "}
                  <span className="text-[0.92rem] text-brand-300">WhatsApp e telefone</span>
                </dd>
              </div>
            )}
            {channels.email && (
              <div className="flex gap-4">
                <dt className="sr-only">E-mail</dt>
                <Mail aria-hidden className="mt-1 h-5 w-5 flex-none text-accent-400" />
                <dd>
                  <a href={`mailto:${channels.email}`} className="whitespace-nowrap text-[1.02rem] font-semibold underline-offset-4 hover:text-accent-300 hover:underline">
                    {channels.email}
                  </a>
                </dd>
              </div>
            )}
          </dl>
          <div className="mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
            <WhatsAppCTA location="location_section" label="Falar no WhatsApp" variant="primary" />
            <Link href="/quem-somos" className="btn btn-ghost text-white">
              Conhecer a CredFlex
            </Link>
          </div>
        </div>
        <div data-reveal="image" className="lg:col-span-7">
          <LocationMap className="aspect-[4/4.4] sm:aspect-[16/11] lg:aspect-auto lg:h-full lg:min-h-[520px]" />
        </div>
      </div>
    </section>
  );
}
