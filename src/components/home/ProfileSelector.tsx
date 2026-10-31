"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { ProfileGlyph } from "@/components/ui/ProfileGlyph";
import { profileOptions, type ProfileOption } from "@/content/profiles";
import { products } from "@/content/products";
import { track } from "@/lib/analytics/events";

const prefersReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function prequalHref(o: ProfileOption) {
  return o.product ? `/simulacao?modalidade=${o.product}` : "/simulacao";
}

/**
 * Seletor de perfil em carrossel horizontal.
 * - Rolagem nativa com scroll-snap (swipe no mobile, inércia, sem bibliotecas).
 * - Setas e indicadores sincronizados com a posição real da rolagem.
 * - Padrão radiogroup: setas do teclado movem a seleção e trazem o card à vista.
 */
export function ProfileSelector() {
  const [selected, setSelected] = useState<string | null>(null);
  const [pos, setPos] = useState({ first: 0, atStart: true, atEnd: false });
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = profileOptions.find((o) => o.id === selected) ?? null;
  const product = current?.product ? products[current.product] : null;

  const measure = useCallback(() => {
    const el = trackRef.current;
    const first = cardRefs.current[0]?.parentElement;
    if (!el || !first) return;
    const step = first.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || "16");
    setPos({
      first: Math.min(profileOptions.length - 1, Math.round(el.scrollLeft / step)),
      atStart: el.scrollLeft < 8,
      atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8,
    });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [measure]);

  function scrollToIndex(i: number) {
    const card = cardRefs.current[i]?.parentElement;
    const el = trackRef.current;
    if (!card || !el) return;
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft || "0"), behavior: prefersReduced() ? "auto" : "smooth" });
  }

  function page(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: prefersReduced() ? "auto" : "smooth" });
  }

  function choose(o: ProfileOption) {
    setSelected(o.id);
    track("product_select", { product: o.product ?? "indefinido", cta_location: "profile_selector" });
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const delta = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    const jump = e.key === "Home" ? -i : e.key === "End" ? profileOptions.length - 1 - i : 0;
    if (!delta && !jump) return;
    e.preventDefault();
    const n = jump ? i + jump : (i + delta + profileOptions.length) % profileOptions.length;
    const btn = cardRefs.current[n];
    btn?.focus({ preventScroll: true });
    btn?.parentElement?.scrollIntoView({ inline: "nearest", block: "nearest", behavior: prefersReduced() ? "auto" : "smooth" });
    choose(profileOptions[n]);
  }

  const focusIndex = Math.max(0, profileOptions.findIndex((o) => o.id === selected));

  return (
    <section id="perfil" aria-labelledby="perfil-title" className="noise overflow-hidden bg-brand-950 py-[var(--section-y)] text-white">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 id="perfil-title" data-reveal="title" className="t-h2 text-white">
              Qual dessas opções combina com você?
            </h2>
            <p className="mt-5 max-w-[46ch] text-[1.08rem] leading-relaxed text-brand-100">
              Cada modalidade tem regras próprias. Escolher o caminho certo desde o início evita perguntas desnecessárias.
            </p>
          </div>
          {/* Controles: posição + setas */}
          <div className="flex items-center gap-5">
            <p className="t-num hidden text-[0.95rem] text-brand-300 sm:block" aria-hidden>
              <span className="font-bold text-white">{String(pos.first + 1).padStart(2, "0")}</span> / {String(profileOptions.length).padStart(2, "0")}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => page(-1)}
                disabled={pos.atStart}
                aria-controls="perfil-track"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white transition-[background-color,border-color,opacity,transform] duration-300 hover:border-accent-400 hover:bg-accent-400 hover:text-brand-950 active:scale-95 disabled:pointer-events-none disabled:opacity-30"
              >
                <ArrowLeft aria-hidden className="h-5 w-5" />
                <span className="sr-only">Opções anteriores</span>
              </button>
              <button
                type="button"
                onClick={() => page(1)}
                disabled={pos.atEnd}
                aria-controls="perfil-track"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white transition-[background-color,border-color,opacity,transform] duration-300 hover:border-accent-400 hover:bg-accent-400 hover:text-brand-950 active:scale-95 disabled:pointer-events-none disabled:opacity-30"
              >
                <ArrowRight aria-hidden className="h-5 w-5" />
                <span className="sr-only">Próximas opções</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trilho: alinhado ao container à esquerda, sangrando até a borda à direita */}
      <div
        id="perfil-track"
        ref={trackRef}
        role="radiogroup"
        aria-labelledby="perfil-title"
        data-reveal="stagger"
        className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          paddingInline: "max(var(--gutter), calc((100vw - 1320px) / 2 + var(--gutter)))",
          scrollPaddingInline: "max(var(--gutter), calc((100vw - 1320px) / 2 + var(--gutter)))",
        }}
      >
        {profileOptions.map((o, i) => {
          const isSel = o.id === selected;
          return (
            <div key={o.id} className="w-[82%] flex-none snap-start xs:w-[68%] sm:w-[46%] lg:w-[calc((min(100vw,1320px)-2*var(--gutter)-2rem)/3.15)]">
              <button
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={isSel}
                tabIndex={i === focusIndex ? 0 : -1}
                onClick={() => choose(o)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`group relative flex h-full min-h-[260px] w-full flex-col overflow-hidden rounded-[var(--radius-lg)] border p-6 text-left transition-[background-color,border-color,transform,box-shadow] duration-500 ease-[var(--ease-out)] focus-visible:outline-offset-4 sm:p-7 ${
                  isSel
                    ? "-translate-y-1 border-accent-400 bg-accent-400 text-brand-950 shadow-[0_30px_60px_-30px_rgb(252_170_6/0.55)]"
                    : "border-white/12 bg-brand-900/70 text-white hover:-translate-y-1 hover:border-white/30 hover:bg-brand-900"
                }`}
              >
                <span className="flex items-start justify-between">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-[var(--radius-sm)] transition-[background-color,color,transform] duration-500 group-hover:rotate-[-6deg] ${
                      isSel ? "bg-brand-900 text-accent-400" : "bg-white/8 text-accent-400"
                    }`}
                  >
                    <ProfileGlyph icon={o.icon} className="h-6 w-6" />
                  </span>
                  <span aria-hidden className={`t-num text-[0.82rem] font-bold ${isSel ? "text-brand-900" : "text-brand-300"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
                <span className={`mt-7 font-[family-name:var(--font-display)] text-[1.32rem] font-semibold leading-[1.15] tracking-[-0.015em] ${isSel ? "text-brand-950" : "text-white"}`}>
                  {o.label}
                </span>
                <span className={`mt-2.5 text-[0.98rem] leading-relaxed ${isSel ? "text-brand-950/80" : "text-brand-300"}`}>{o.explanation}</span>
                <span className="mt-auto flex items-center gap-2.5 pt-6 text-[0.92rem] font-bold">
                  <span
                    aria-hidden
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      isSel ? "border-brand-950 bg-brand-950 text-accent-400" : "border-white/35 text-transparent group-hover:border-accent-400"
                    }`}
                  >
                    <Check className={`h-3.5 w-3.5 ${isSel ? "anim-pop" : ""}`} strokeWidth={3.5} />
                  </span>
                  <span className={isSel ? "text-brand-950" : "text-brand-100"}>{isSel ? "Selecionado" : "Selecionar"}</span>
                </span>
              </button>
            </div>
          );
        })}
        {/* Espaçador final para o último card encostar no snap */}
        <div aria-hidden className="w-px flex-none" />
      </div>

      <div className="container-x">
        {/* Indicadores de posição */}
        <div className="mt-4 flex gap-1.5" aria-hidden>
          {profileOptions.map((o, i) => (
            <button
              key={o.id}
              type="button"
              tabIndex={-1}
              onClick={() => scrollToIndex(i)}
              className="group/dot py-2"
            >
              <span
                className={`block h-[3px] rounded-full transition-all duration-500 ${
                  i === pos.first ? "w-10 bg-accent-400" : o.id === selected ? "w-5 bg-accent-400/60" : "w-5 bg-white/20 group-hover/dot:bg-white/40"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Próximo passo — desliza quando há seleção */}
        <div aria-live="polite" className="mt-8 min-h-[148px] sm:min-h-[96px]">
          {current ? (
            <div key={current.id} className="anim-fade flex flex-col gap-5 border-t border-white/12 pt-7 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-[60ch]">
                <p className="font-semibold text-accent-300">Próximo passo</p>
                <p className="mt-1.5 text-[1.05rem] leading-relaxed text-white">{current.next}</p>
              </div>
              <div className="flex flex-none flex-col gap-3 sm:flex-row sm:items-center">
                {product && (
                  <Link href={`/${product.slug}`} className="link-arrow min-h-11 justify-center text-brand-100 sm:justify-start">
                    Conhecer a modalidade
                  </Link>
                )}
                <Link
                  href={prequalHref(current)}
                  onClick={() => track("cta_click", { cta_id: "profile_prequal", cta_location: "profile_selector", product: current.product ?? "indefinido" })}
                  className="btn btn-primary"
                >
                  {product ? product.ctaLabel : "Responder perguntas"}
                  <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                </Link>
              </div>
            </div>
          ) : (
            <p className="flex items-center gap-3 border-t border-white/12 pt-7 text-brand-300">
              <span className="fbars" aria-hidden />
              Selecione a situação mais parecida com a sua para ver o próximo passo.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
