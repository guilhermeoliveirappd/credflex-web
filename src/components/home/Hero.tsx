import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Monogram } from "@/components/brand/Monogram";

/*
 * Headline — alternativas avaliadas:
 *  1. "Seu crédito começa com clareza." — boa, mas "clareza" é palavra gasta no setor.
 *  2. "Crédito, sem rodeios."  ← escolhida: 3 palavras, tom humano e direto, diz o que
 *     é (crédito) e como é tratado (sem enrolação); compõe em 2 linhas fixas.
 *  3. "Crédito que você entende." — clara, porém menos memorável.
 */
function Word({ i, children }: { i: number; children: React.ReactNode }) {
  return (
    <span className="hero-word">
      <span style={{ ["--i" as string]: i }}>{children}</span>
    </span>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-accent-400">
      <div className="container-x grid items-center gap-10 pb-14 pt-12 sm:pt-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="lg:col-span-6 xl:col-span-6">
          <h1 id="hero-title" className="t-display text-brand-950 !text-[clamp(3rem,1.8rem+4.6vw,6.3rem)] !leading-[0.96]">
            <Word i={0}>Crédito,</Word>
            <br />
            <Word i={1}>sem</Word> <Word i={2}>rodeios.</Word>
          </h1>
          <p className="hero-in mt-6 max-w-[30ch] text-[1.1rem] leading-snug text-brand-950/85 sm:text-[1.2rem]" style={{ ["--d" as string]: "280ms" }}>
            Consignado, FGTS e mais, com atendimento humano em Osvaldo Cruz.
          </p>
          <div className="hero-in mt-8" style={{ ["--d" as string]: "380ms" }}>
            <Link href="/simulacao" className="btn btn-brand min-h-[56px] px-7 text-[1.05rem]" data-cta="hero_prequal">
              Consultar meu crédito
              <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Placa da marca: destino da abertura (o fundo roxo se recolhe até aqui) */}
        <div className="lg:col-span-5 lg:col-start-8">
          <div
            data-hero-panel
            className="hero-panel noise relative ml-auto grid aspect-[4/3] w-full max-w-[440px] place-items-center overflow-hidden rounded-[96px_24px_24px_24px] bg-brand-900 sm:aspect-square sm:rounded-[140px_28px_28px_28px] lg:mr-0"
          >
            <div data-hero-mark className="hero-mark w-[44%] translate-x-[4%] text-accent-400">
              <Monogram className="h-auto w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
