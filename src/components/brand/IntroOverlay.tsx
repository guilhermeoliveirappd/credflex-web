"use client";

import { useEffect, useRef } from "react";
import { SYMBOL_PATH, SYMBOL_VIEWBOX } from "./logo-paths";

/**
 * "CF Brand Reveal" — a abertura É o hero.
 * 1. (CSS, 0–0,55s) Tela roxa; o símbolo oficial entra por uma máscara
 *    circular que gira a partir do centro do C.
 * 2. (JS, ~0,55–1,3s) O fundo roxo se recolhe por recorte geométrico
 *    (clip-path inset arredondado) até coincidir com a placa roxa do hero,
 *    e o símbolo viaja/escala até a sua posição final dentro dela. O amarelo
 *    da página aparece em volta. Nada some com fade: tudo vira o próprio hero.
 * Sem strokes, sem distorção (escala uniforme), só transform/clip-path.
 * Sem JS, o CSS encerra a abertura sozinho. Uma vez por sessão.
 */
const gate = `(function(){try{var d=document.documentElement;var r=matchMedia('(prefers-reduced-motion: reduce)').matches;if(r||sessionStorage.getItem('cf_intro')){d.dataset.intro='skip';return}sessionStorage.setItem('cf_intro','1');d.dataset.intro='play'}catch(e){}})();`;

const EASE = "cubic-bezier(0.83, 0, 0.17, 1)";

export function IntroOverlay() {
  const bgRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const mark = markRef.current;
    const bg = bgRef.current;
    if (html.dataset.intro !== "play" || !mark || !bg) return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const start = Math.max(0, 560 - performance.now());

    timers.push(
      setTimeout(() => {
        if (cancelled) return;
        const panel = document.querySelector<HTMLElement>("[data-hero-panel]");
        const target = document.querySelector<HTMLElement>("[data-hero-mark]");
        if (!panel || !target || typeof mark.animate !== "function") {
          html.dataset.intro = "done";
          return;
        }
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const p = panel.getBoundingClientRect();
        // Raios reais da placa (canto superior esquerdo amplo, eco do arco do C)
        const cs = getComputedStyle(panel);
        const radius = [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius].join(" ");
        const from = mark.getBoundingClientRect();
        const to = target.getBoundingClientRect();
        const dx = to.left + to.width / 2 - (from.left + from.width / 2);
        const dy = to.top + to.height / 2 - (from.top + from.height / 2);
        const k = to.width / from.width; // escala uniforme: sem distorção

        const D = 720;
        bg.animate(
          [
            { clipPath: "inset(0px 0px 0px 0px round 0px)" },
            { clipPath: `inset(${p.top}px ${vw - p.right}px ${vh - p.bottom}px ${p.left}px round ${radius})` },
          ],
          { duration: D, easing: EASE, fill: "forwards" },
        );
        mark.animate([{ transform: "translate(0,0) scale(1)" }, { transform: `translate(${dx}px, ${dy}px) scale(${k})` }], {
          duration: D,
          easing: EASE,
          fill: "forwards",
        });
        // Texto entra enquanto a placa se forma
        timers.push(setTimeout(() => !cancelled && (html.dataset.intro = "reveal"), 240));
        timers.push(setTimeout(() => !cancelled && (html.dataset.intro = "done"), D + 20));
      }, start),
    );

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: gate }} />
      <div className="cf-intro" aria-hidden>
        <div ref={bgRef} className="cf-intro-bg noise absolute" />
        <div className="cf-intro-stage">
          <div ref={markRef} className="cf-intro-mark">
            <svg viewBox={SYMBOL_VIEWBOX} className="h-auto w-full" focusable="false">
              <path d={SYMBOL_PATH} fill="currentColor" fillRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
