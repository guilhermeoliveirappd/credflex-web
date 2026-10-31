import Link from "next/link";
import { MapPin } from "lucide-react";
import { PhotoSlot } from "@/components/brand/PhotoSlot";
import { ReviewMark } from "@/components/brand/ReviewMark";
import { site } from "@/content/site";

export function LocationSection() {
  const { location } = site;
  return (
    <section aria-labelledby="local-title" className="relative bg-brand-950 text-white">
      <div className="grid lg:grid-cols-2">
        <PhotoSlot
          alt={`Fachada do escritório da CredFlex em ${location.city}/${location.state}`}
          brief="Fachada do escritório com a identificação da marca visível. Horizontal, luz natural."
          className="aspect-[4/3] lg:aspect-auto lg:min-h-[640px]"
          tone="navy"
        />
        <div className="container-x flex flex-col justify-center py-16 lg:max-w-[640px] lg:px-16 lg:py-24">
          <h2 id="local-title" className="t-h1 text-white">
            {location.city},
            <br />
            <span className="text-accent-400">São Paulo.</span>
          </h2>
          <p className="t-lead mt-6 max-w-[38ch] text-brand-100">
            Um escritório de verdade, onde você pode conversar pessoalmente com a equipe — e levar quem quiser junto.
          </p>
          <div className="mt-8 flex items-start gap-3 border-t border-white/10 pt-6">
            <MapPin aria-hidden className="mt-0.5 h-5 w-5 flex-none text-accent-400" />
            <div>
              {location.street ? (
                <p>
                  {location.street} — {location.city}/{location.state}
                  {location.postalCode && `, CEP ${location.postalCode}`}
                </p>
              ) : (
                <p className="text-brand-300">
                  Endereço completo em confirmação. <ReviewMark note={location.note} />
                </p>
              )}
              {location.openingHours && <p className="mt-1 text-brand-300">{location.openingHours}</p>}
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/quem-somos" className="btn btn-primary">
              Conhecer a CredFlex
            </Link>
            {location.mapsUrl && (
              <a href={location.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                Como chegar
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
