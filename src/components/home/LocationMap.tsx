"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Monogram } from "@/components/brand/Monogram";
import { CONSENT_EVENT, readConsent, type ConsentState } from "@/lib/privacy/consent";
import { site } from "@/content/site";

const PREF_KEY = "cf_maps_ok";
const { location } = site;
const fullAddress = `${location.street}, ${location.district}, ${location.city} - ${location.state}, ${location.postalCode}`;
const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(`CredFlex, ${fullAddress}`)}&hl=pt-BR&z=17&output=embed`;

type State = "idle" | "loading" | "ready" | "failed";

/**
 * Mapa do Google com carregamento sob demanda (privacidade):
 * nada é solicitado ao Google até o clique em "Carregar mapa" — ou
 * automaticamente se a pessoa já aceitou cookies de publicidade ou já
 * carregou o mapa antes neste navegador. Sem iframe, mostra uma prévia
 * estilizada com o endereço, que também é o fallback em caso de falha.
 */
export function LocationMap({ className = "" }: { className?: string }) {
  const [state, setState] = useState<State>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

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

  useEffect(() => {
    if (state !== "loading") return;
    timer.current = setTimeout(() => setState((s) => (s === "loading" ? "failed" : s)), 10_000);
    return () => clearTimeout(timer.current);
  }, [state]);

  function load() {
    try {
      localStorage.setItem(PREF_KEY, "1");
    } catch {}
    setState("loading");
  }

  return (
    <div className={`relative overflow-hidden rounded-[var(--radius-lg)] bg-brand-900 ring-1 ring-white/10 ${className}`}>
      {/* Prévia / fallback: sempre presente por baixo do iframe */}
      <div aria-hidden={state === "ready"} className="absolute inset-0">
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 600 480" aria-hidden>
          <rect width="600" height="480" fill="var(--color-brand-900)" />
          <g stroke="rgb(255 255 255 / 0.07)" strokeWidth="1">
            {Array.from({ length: 13 }, (_, i) => (
              <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50 - 120} y2="480" />
            ))}
            {Array.from({ length: 11 }, (_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 48} x2="600" y2={i * 48 + 30} />
            ))}
          </g>
          <path d="M-20 300 C 150 270, 260 320, 380 250 S 560 200, 640 230" fill="none" stroke="rgb(255 255 255 / 0.16)" strokeWidth="14" />
          <path d="M310 -10 L 280 500" fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="10" />
        </svg>
        <div className="absolute left-1/2 top-[44%] flex -translate-x-1/2 -translate-y-full flex-col items-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-400 text-brand-950 shadow-[0_12px_30px_-8px_rgb(252_170_6/0.6)]">
            <Monogram className="h-7 w-7" />
          </span>
          <span className="-mt-1 h-3 w-3 rotate-45 bg-accent-400" />
        </div>
        <div className="absolute inset-x-4 bottom-20 mx-auto max-w-sm rounded-[var(--radius-md)] bg-white/95 p-3 text-center text-brand-950 shadow-lg backdrop-blur sm:bottom-24 sm:p-4">
          <p className="no-justify hidden font-bold sm:block">{location.street}</p>
          <p className="no-justify hidden text-[0.95rem] text-ink-2 sm:block">
            {location.district} · {location.city} – {location.state} · CEP {location.postalCode}
          </p>
          {state === "idle" && (
            <>
              <button type="button" onClick={load} className="btn btn-brand min-h-11 w-full text-[0.95rem] sm:mt-3">
                <MapPin aria-hidden className="h-4 w-4" /> Carregar mapa interativo
              </button>
              <p className="no-justify mt-2 text-[0.8rem] leading-snug text-stone">O mapa é fornecido pelo Google e pode usar cookies.</p>
            </>
          )}
          {state === "failed" && <p className="no-justify mt-2 text-[0.9rem] font-semibold text-error">Não foi possível carregar o mapa agora.</p>}
        </div>
      </div>

      {(state === "loading" || state === "ready") && (
        <iframe
          src={embedSrc}
          title={`Mapa: CredFlex — ${fullAddress}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          onLoad={() => {
            clearTimeout(timer.current);
            setState("ready");
          }}
          className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-700 [filter:saturate(0.85)_contrast(1.02)] ${state === "ready" ? "opacity-100" : "opacity-0"}`}
        />
      )}

      {/* Ação sempre disponível */}
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
