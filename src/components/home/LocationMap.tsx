"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Monogram } from "@/components/brand/Monogram";
import { CONSENT_EVENT, readConsent, type ConsentState } from "@/lib/privacy/consent";
import { site } from "@/content/site";

const PREF_KEY = "cf_maps_ok";
const { location } = site;
const fullAddress = `${location.street}, ${location.district}, ${location.city} - ${location.state}, ${location.postalCode}`;

/**
 * Origem do mapa, em ordem de preferência:
 * 1. NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL: o `src` do iframe gerado em Google Maps ›
 *    Compartilhar › Incorporar um mapa (marcador exato do Perfil da Empresa).
 * 2. NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY: Maps Embed API oficial (gratuita, exige chave).
 * 3. Sem configuração: incorporação clássica sem chave, pelo endereço completo.
 */
export function mapEmbedSrc() {
  const official = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL;
  if (official) return official;
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
  const q = encodeURIComponent(fullAddress);
  if (key) return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=${q}&zoom=17&language=pt-BR`;
  return `https://maps.google.com/maps?q=${q}&z=17&hl=pt-BR&output=embed`;
}

type State = "idle" | "loading" | "ready" | "slow";

/**
 * Mapa do Google sob demanda (conteúdo de terceiros): só é solicitado ao
 * Google após o clique, com consentimento de publicidade, ou se a pessoa já
 * o carregou antes neste navegador. Antes disso, um painel honesto com o
 * endereço (não imita um mapa). "Abrir no Google Maps" funciona sempre.
 */
export function LocationMap({ className = "" }: { className?: string }) {
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    const auto = (c: ConsentState | null) => {
      let remembered = false;
      try {
        remembered = localStorage.getItem(PREF_KEY) === "1";
      } catch {}
      if (remembered || c?.marketing) setState((s) => (s === "idle" ? "loading" : s));
    };
    auto(readConsent());
    const onConsent = (e: Event) => auto((e as CustomEvent<ConsentState>).detail);
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, []);

  // Se demorar, oferece a alternativa sem remover o iframe (ele pode terminar de carregar).
  useEffect(() => {
    if (state !== "loading") return;
    const t = setTimeout(() => setState((s) => (s === "loading" ? "slow" : s)), 12_000);
    return () => clearTimeout(t);
  }, [state]);

  function load() {
    try {
      localStorage.setItem(PREF_KEY, "1");
    } catch {}
    setState("loading");
  }

  return (
    <div className={`noise relative overflow-hidden rounded-[var(--radius-lg)] bg-brand-900 ring-1 ring-white/10 ${className}`}>
      {/* Painel de espera / alternativa: endereço real, sem simular um mapa */}
      <div
        aria-hidden={state === "ready"}
        className={`absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 pb-20 text-center transition-opacity duration-500 ${state === "ready" ? "opacity-0" : "opacity-100"}`}
      >
        <Monogram className="h-14 w-14 text-accent-400" />
        <div>
          <p className="font-semibold text-white">{location.street}</p>
          <p className="mt-0.5 text-[0.95rem] text-brand-300">
            {location.district}, {location.city}/{location.state} · CEP {location.postalCode}
          </p>
        </div>
        {state === "idle" && (
          <div className="flex flex-col items-center gap-2">
            <button type="button" onClick={load} className="btn btn-primary min-h-11 text-[0.95rem]">
              <MapPin aria-hidden className="h-4 w-4" /> Mostrar mapa
            </button>
            <p className="max-w-[30ch] text-[0.8rem] leading-snug text-brand-300">O mapa é carregado do Google, que pode usar cookies.</p>
          </div>
        )}
        {state === "loading" && (
          <p className="text-[0.9rem] text-brand-300" role="status">
            Carregando o mapa…
          </p>
        )}
        {state === "slow" && (
          <p className="max-w-[34ch] text-[0.9rem] text-brand-100" role="status">
            O mapa está demorando para carregar. Use o botão abaixo para abrir a localização no Google Maps.
          </p>
        )}
      </div>

      {state !== "idle" && (
        <iframe
          src={mapEmbedSrc()}
          title={`Mapa da CredFlex: ${fullAddress}`}
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          onLoad={() => setState("ready")}
          className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-700 ${state === "ready" ? "opacity-100" : "opacity-0"}`}
        />
      )}

      <a
        href={location.mapsUrl ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 left-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-950/90 px-4 text-[0.92rem] font-semibold text-white shadow-lg backdrop-blur transition-colors hover:bg-accent-400 hover:text-brand-950"
      >
        Abrir no Google Maps <ArrowUpRight aria-hidden className="h-4 w-4" />
      </a>
    </div>
  );
}
