"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { ProfileGlyph } from "@/components/ui/ProfileGlyph";
import { profileOptions, type ProfileOption } from "@/content/profiles";
import { products } from "@/content/products";
import { track } from "@/lib/analytics/events";

function prequalHref(o: ProfileOption) {
  return o.product ? `/simulacao?modalidade=${o.product}` : "/simulacao";
}

function NextStep({ option, compact = false }: { option: ProfileOption | null; compact?: boolean }) {
  if (!option) {
    return (
      <div className="border-l-2 border-white/15 pl-5">
        <p className="text-brand-300">Selecione a situação mais parecida com a sua para ver o próximo passo.</p>
      </div>
    );
  }
  const product = option.product ? products[option.product] : null;
  return (
    <div className={compact ? "" : "border-l-2 border-accent-400 pl-5"} aria-live="polite">
      <p className="font-bold text-accent-300">O que acontece agora</p>
      <p className="mt-2 text-[1.05rem] leading-relaxed text-white">{option.next}</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Link
          href={prequalHref(option)}
          onClick={() => track("cta_click", { cta_id: "profile_prequal", cta_location: "profile_selector", product: option.product ?? "indefinido" })}
          className="btn btn-primary"
        >
          {product ? product.ctaLabel : "Responder perguntas"}
          <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
        </Link>
        {product && (
          <Link href={`/${product.slug}`} className="link-arrow min-h-11 text-accent-300">
            Conhecer {product.name}
          </Link>
        )}
      </div>
    </div>
  );
}

export function ProfileSelector() {
  const [selected, setSelected] = useState<string | null>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = profileOptions.find((o) => o.id === selected) ?? null;

  function choose(o: ProfileOption) {
    setSelected(o.id);
    track("product_select", { product: o.product ?? "indefinido", cta_location: "profile_selector" });
  }

  // Padrão de radiogroup: setas movem o foco e a seleção.
  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const delta = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const n = (i + delta + profileOptions.length) % profileOptions.length;
    refs.current[n]?.focus();
    choose(profileOptions[n]);
  }

  const focusIndex = Math.max(0, profileOptions.findIndex((o) => o.id === selected));

  return (
    <section id="perfil" aria-labelledby="perfil-title" className="relative bg-brand-950 py-[var(--section-y)] text-white">
      <div aria-hidden className="grain absolute inset-0 opacity-50" />
      <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+40px)]">
            <h2 id="perfil-title" className="t-h2 text-white">
              Qual dessas opções combina com você?
            </h2>
            <p className="t-lead mt-5 max-w-[40ch] text-brand-100">
              Cada modalidade tem regras próprias. Escolher o caminho certo desde o início evita perguntas desnecessárias.
            </p>
            <div className="mt-10 hidden lg:block">
              <NextStep option={current} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div role="radiogroup" aria-labelledby="perfil-title" className="divide-y divide-white/10 border-y border-white/10">
            {profileOptions.map((o, i) => {
              const isSel = o.id === selected;
              return (
                <div key={o.id} className={`relative transition-colors duration-300 ${isSel ? "bg-brand-900" : ""}`}>
                  <span aria-hidden className={`absolute inset-y-0 left-0 w-[3px] origin-top bg-accent-400 transition-transform duration-300 ${isSel ? "scale-y-100" : "scale-y-0"}`} />
                  <button
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    type="button"
                    role="radio"
                    aria-checked={isSel}
                    tabIndex={i === focusIndex ? 0 : -1}
                    onClick={() => choose(o)}
                    onKeyDown={(e) => onKeyDown(e, i)}
                    className="group grid w-full grid-cols-[auto_1fr_auto] items-start gap-4 px-4 py-5 text-left sm:gap-5 sm:px-6 sm:py-6 focus-visible:outline-offset-[-3px]"
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] border transition-colors duration-300 ${
                        isSel ? "border-accent-400 bg-accent-400 text-brand-950" : "border-white/20 text-accent-300 group-hover:border-accent-400/70"
                      }`}
                    >
                      <ProfileGlyph icon={o.icon} />
                    </span>
                    <span>
                      <span className="flex items-baseline gap-3">
                        <span aria-hidden className="t-num text-[0.78rem] font-bold text-brand-300">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className={`text-[1.1rem] font-bold leading-snug sm:text-[1.2rem] ${isSel ? "text-white" : "text-brand-100 group-hover:text-white"}`}>
                          {o.label}
                        </span>
                      </span>
                      <span className="mt-1.5 block pl-8 text-[0.97rem] leading-relaxed text-brand-300">{o.explanation}</span>
                    </span>
                    <span
                      aria-hidden
                      className={`mt-1 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        isSel ? "border-accent-400 bg-accent-400 text-brand-950" : "border-white/30 text-transparent group-hover:border-white/60"
                      }`}
                    >
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                  </button>
                  {isSel && (
                    <div className="px-4 pb-6 pl-[4.75rem] sm:px-6 sm:pl-[5.5rem] lg:hidden">
                      <NextStep option={o} compact />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
