import Image from "next/image";
import { showReviewMarkers } from "@/content/site";

/**
 * Espaço para fotografia REAL da CredFlex. Sem `src`, renderiza um painel
 * de marca neutro; em revisão, identifica qual foto deve ser fornecida.
 * Nunca usar banco de imagens para simular equipe, clientes ou escritório.
 */
export function PhotoSlot({
  src,
  alt,
  brief,
  className = "",
  tone = "navy",
  priority = false,
  sizes = "(min-width: 1024px) 40vw, 100vw",
}: {
  src?: string;
  alt: string;
  /** Descrição da foto necessária (para o time da CredFlex). */
  brief: string;
  className?: string;
  tone?: "navy" | "sand" | "gold";
  priority?: boolean;
  sizes?: string;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }
  const bg =
    tone === "navy" ? "bg-brand-800 text-brand-300" : tone === "gold" ? "bg-accent-300 text-brand-900" : "bg-sand text-stone";
  return (
    <div className={`relative overflow-hidden ${bg} ${className}`} role="img" aria-label={`Espaço reservado para fotografia: ${alt}`}>
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{ backgroundImage: "repeating-linear-gradient(-35deg, transparent 0 13px, color-mix(in srgb, currentColor 22%, transparent) 13px 14px)" }}
      />
      {showReviewMarkers && (
        <div className="absolute right-3 top-3 max-w-[min(78%,360px)] rounded-[4px] bg-black/55 px-3 py-2 text-[0.78rem] leading-snug text-white backdrop-blur-[2px]">
          <strong className="block text-[0.68rem] uppercase tracking-[0.12em] text-accent-300">Foto real a receber</strong>
          {brief}
        </div>
      )}
    </div>
  );
}
