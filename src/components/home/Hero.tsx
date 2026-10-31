import Link from "next/link";
import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import { Monogram } from "@/components/brand/Monogram";

/*
 * Headline — alternativas avaliadas (3 a 6 palavras):
 *  1. "Crédito com gente de verdade."  ← escolhida: diz o que é (crédito) e o
 *     diferencial real (atendimento humano); 5 palavras, quebra bem em 2–3 linhas.
 *  2. "Crédito explicado, pessoa a pessoa." — boa, mas "explicado" soa didático.
 *  3. "Seu crédito começa numa conversa." — mais longa no mobile e menos direta.
 */
const words = ["Crédito", "com", "gente"];

function Word({ i, children }: { i: number; children: React.ReactNode }) {
  return (
    <span className="hero-word">
      <span style={{ ["--i" as string]: i }}>{children}</span>
    </span>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-accent-400">
      {/* Composição: o símbolo oficial em grande escala, sangrando à direita.
          É o ponto de chegada da animação de abertura (data-hero-mark). */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-full lg:w-[58%]">
        <div className="hero-mark-echo absolute -right-[20vw] -bottom-[30vw] w-[96vw] text-brand-900/10 sm:-right-[14%] sm:-bottom-[22vw] sm:w-[70%] lg:-right-[8%] lg:bottom-auto lg:top-1/2 lg:w-[92%] lg:-translate-y-[46%]">
          <Monogram className="h-auto w-full rotate-[14deg]" />
        </div>
        <div className="absolute -right-[24vw] -bottom-[26vw] w-[90vw] sm:-right-[16%] sm:-bottom-[18vw] sm:w-[64%] lg:-right-[10%] lg:bottom-auto lg:top-1/2 lg:w-[86%] lg:-translate-y-1/2">
          <div data-hero-mark className="hero-mark text-brand-900">
            <Monogram className="h-auto w-full" />
          </div>
        </div>
      </div>

      <div className="container-x flex flex-col justify-start pb-[72vw] pt-12 sm:pb-[48vw] sm:pt-16 lg:min-h-[640px] lg:justify-center lg:py-24">
        <div>
          <h1 id="hero-title" className="t-display max-w-[6.6em] text-brand-950 !text-[clamp(3rem,1.6rem+6.4vw,7.25rem)] !leading-[0.92]">
            {words.map((w, i) => (
              <Fragment key={w}>
                <Word i={i}>{w}</Word>{" "}
              </Fragment>
            ))}
            <Word i={3}>de</Word> <Word i={4}>verdade.</Word>
          </h1>
        </div>
        <p className="hero-in mt-7 max-w-[32ch] text-[1.15rem] leading-snug text-brand-950 sm:text-[1.3rem]" style={{ ["--d" as string]: "320ms" }}>
          Consignado, FGTS e outras modalidades, com atendimento humano em Osvaldo Cruz.
        </p>
        <div className="hero-in mt-9" style={{ ["--d" as string]: "440ms" }}>
          <Link href="/simulacao" className="btn btn-brand min-h-[58px] px-7 text-[1.08rem]" data-cta="hero_prequal">
            Consultar meu crédito
            <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
