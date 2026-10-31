import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, MessageCircle } from "lucide-react";
import { CFPath } from "@/components/brand/CFPath";
import { ReviewMark } from "@/components/brand/ReviewMark";
import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";
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
            {location.street} — {location.district}
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
        <a href={`mailto:${channels.email}`} className="break-all hover:underline">
          {channels.email}
        </a>
      ),
    },
  ].filter((r): r is Exclude<typeof r, "" | null | false | undefined> => !!r);

  return (
    <div className={`rounded-[var(--radius-md)] p-6 sm:p-9 ${dark ? "border border-white/10 bg-brand-900" : "bg-white ring-1 ring-sand"} ${className}`}>
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
  const { location } = site;
  return (
    <section aria-labelledby="local-title" className="relative overflow-hidden bg-brand-950 py-[var(--section-y)] text-white">
      <CFPath className="pointer-events-none absolute -bottom-[30%] -left-[12%] w-[52%] opacity-[0.12]" stroke="var(--color-accent-400)" weight={1.2} />
      <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6">
          <h2 id="local-title" className="t-h1 text-white">
            {location.city},
            <br />
            <span className="text-accent-400">São Paulo.</span>
          </h2>
          <p className="t-lead mt-6 max-w-[42ch] text-brand-100">
            Estamos no centro de {location.city}, na {location.street?.split(",")[0]}. Venha conversar pessoalmente com a
            equipe, sem pressa e com todas as explicações — e traga quem quiser junto.
          </p>
          <div className="mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
            <WhatsAppCTA location="location_section" label="Falar no WhatsApp" variant="primary" />
            {location.mapsUrl && (
              <a href={location.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-white">
                Como chegar <ArrowUpRight aria-hidden className="h-4 w-4" />
              </a>
            )}
          </div>
          <Link href="/quem-somos" className="link-arrow mt-7 text-accent-300">
            Conhecer a CredFlex
          </Link>
        </div>
        <ContactCard className="lg:col-span-5 lg:col-start-8" />
      </div>
    </section>
  );
}
