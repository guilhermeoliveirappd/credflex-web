"use client";

import { useEffect, useRef } from "react";
import { SYMBOL_PATH, SYMBOL_VIEWBOX } from "./logo-paths";

/**
 * Abertura da home — "inversão": o símbolo oficial entra em espiral (três
 * camadas do próprio símbolo convergindo), depois viaja até o símbolo gigante
 * do hero enquanto inverte de amarelo para roxo e a cortina roxa sobe,
 * revelando o amarelo. Nenhum traço/stroke: só a forma sólida do símbolo.
 *
 * Fase 1 (0–0,8s) é CSS puro e começa na primeira pintura (HTML do servidor).
 * Fase 2 (~0,85–1,65s) usa as coordenadas reais do [data-hero-mark] (FLIP).
 * Sem JS, o CSS encerra a abertura sozinho. Uma vez por sessão.
 */
const gate = `(function(){try{var d=document.documentElement;var r=matchMedia('(prefers-reduced-motion: reduce)').matches;if(r||sessionStorage.getItem('cf_intro')){d.dataset.intro='skip';return}sessionStorage.setItem('cf_intro','1');d.dataset.intro='play'}catch(e){}})();`;

const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

export function IntroOverlay() {
  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const root = rootRef.current;
    const mark = markRef.current;
    const bg = bgRef.current;
    if (html.dataset.intro !== "play" || !root || !mark || !bg) return;

    let cancelled = false;
    const finish = () => {
      html.dataset.intro = "done";
    };
    // Fase 2 começa ~0,85s após a navegação (ou já, se a hidratação atrasou).
    const wait = Math.max(0, 850 - performance.now());
    const t = setTimeout(() => {
      if (cancelled) return;
      const target = document.querySelector<HTMLElement>("[data-hero-mark]");
      if (!target || typeof mark.animate !== "function") return finish();
      const from = mark.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const dx = to.left + to.width / 2 - (from.left + from.width / 2);
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);
      const k = to.width / from.width;

      root.classList.add("is-leaving");
      const opts: KeyframeAnimationOptions = { duration: 820, easing: EASE, fill: "forwards" };
      mark.animate(
        [
          { transform: "translate(0, 0) scale(1)", color: "var(--color-accent-400)" },
          { transform: `translate(${dx}px, ${dy}px) scale(${k})`, color: "var(--color-brand-900)" },
        ],
        opts,
      );
      bg.animate([{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(0 0 100% 0)" }], { ...opts, duration: 760, delay: 60 });
      // Texto do hero entra enquanto o símbolo ainda viaja
      setTimeout(() => !cancelled && (html.dataset.intro = "reveal"), 260);
      setTimeout(() => !cancelled && finish(), 840);
    }, wait);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  const shape = (
    <svg viewBox={SYMBOL_VIEWBOX} className="h-auto w-full" aria-hidden focusable="false">
      <path d={SYMBOL_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  );

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: gate }} />
      <div ref={rootRef} className="cf-intro" aria-hidden>
        <div ref={bgRef} className="cf-intro-bg noise absolute" />
        <div className="cf-intro-stage">
          {/* Camadas-eco: o próprio símbolo em tons do roxo, convergindo em espiral */}
          <div className="cf-intro-echo cf-intro-echo-2">{shape}</div>
          <div className="cf-intro-echo cf-intro-echo-1">{shape}</div>
          <div ref={markRef} className="cf-intro-mark">
            {shape}
          </div>
        </div>
      </div>
    </>
  );
}
