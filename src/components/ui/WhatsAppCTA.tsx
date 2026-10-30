"use client";

import { MessageCircle } from "lucide-react";
import { showReviewMarkers } from "@/content/site";
import type { ProductSlug } from "@/content/products";
import { track } from "@/lib/analytics/events";
import { buildWhatsappUrl } from "@/lib/leads/whatsapp";

/**
 * Só habilita com destino oficial configurado (NEXT_PUBLIC_WHATSAPP_NUMBER).
 * Sem configuração: em revisão, mostra estado desabilitado explicado; em
 * produção, não renderiza.
 */
export function WhatsAppCTA({
  product,
  protocol,
  href,
  location,
  label = "Continuar pelo WhatsApp",
  variant = "ghost",
  className = "",
}: {
  product?: ProductSlug;
  protocol?: string;
  /** URL já montada pelo servidor (ex.: após registro do lead). */
  href?: string | null;
  location: string;
  label?: string;
  variant?: "ghost" | "primary" | "navy";
  className?: string;
}) {
  const url = href ?? buildWhatsappUrl({ product, protocol });
  if (!url) {
    if (!showReviewMarkers) return null;
    return (
      <span className={`inline-flex flex-col gap-1 ${className}`}>
        <button type="button" disabled className={`btn btn-${variant}`} aria-describedby={`wa-off-${location}`}>
          <MessageCircle aria-hidden className="h-5 w-5" /> {label}
        </button>
        <span id={`wa-off-${location}`} className="review-mark self-start">
          WhatsApp oficial não configurado
        </span>
      </span>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_click", { cta_location: location, product, lead_protocol: protocol })}
      className={`btn btn-${variant} ${className}`}
    >
      <MessageCircle aria-hidden className="h-5 w-5" /> {label}
    </a>
  );
}
