import { SYMBOL_PATH } from "./logo-paths";

/**
 * Abertura da home: o símbolo oficial (vetor real) desenha-se em amarelo sobre
 * o roxo, preenche-se e passa a ser a "janela" de uma máscara — o zoom no
 * traço do C revela a página. Só CSS (globals.css › INTRO DA HOME).
 *
 * Não bloqueia a navegação (pointer-events: none), não altera o layout
 * (position: fixed) e roda uma vez por sessão.
 */
const gate = `(function(){try{var d=document.documentElement;var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(r||sessionStorage.getItem('cf_intro')){d.dataset.intro='skip';return}sessionStorage.setItem('cf_intro','1');setTimeout(function(){d.dataset.intro='done'},1900)}catch(e){}})();`;

export function IntroOverlay() {
  // Símbolo centralizado no sistema de coordenadas (600×617 → origem no centro).
  const mark = <path d={SYMBOL_PATH} transform="translate(-300 -308)" />;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: gate }} />
      <svg className="cf-intro" viewBox="-2700 -2700 5400 5400" preserveAspectRatio="xMidYMid slice" aria-hidden focusable="false">
        <defs>
          <mask id="cf-intro-mask" maskUnits="userSpaceOnUse" x="-2700" y="-2700" width="5400" height="5400">
            <rect x="-2700" y="-2700" width="5400" height="5400" fill="#fff" />
            <g className="cf-intro-zoom" fill="#000">
              {mark}
            </g>
          </mask>
        </defs>
        <rect x="-2700" y="-2700" width="5400" height="5400" fill="var(--color-brand-900)" mask="url(#cf-intro-mask)" />
        <g className="cf-intro-mark" fill="var(--color-accent-400)" stroke="var(--color-accent-400)" strokeWidth="3" vectorEffect="non-scaling-stroke">
          {mark}
        </g>
      </svg>
    </>
  );
}
