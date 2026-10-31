import Link from "next/link";
import { Fragment } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { CFPath } from "@/components/brand/CFPath";
import { PhotoSlot } from "@/components/brand/PhotoSlot";
import { photos } from "@/content/photos";

const words = ["Antes", "do", "crédito,", "uma", "conversa"];

/** Palavra com máscara: sobe de dentro da própria linha (reveal tipográfico). */
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
      <div className="container-x relative grid gap-10 pb-14 pt-10 sm:pt-14 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-20">
        <div className="relative z-10 lg:col-span-7 lg:pr-6">
          <h1 id="hero-title" className="t-display text-brand-950">
            {words.map((w, i) => (
              <Fragment key={w}>
                <Word i={i}>{w}</Word>{" "}
              </Fragment>
            ))}
            <span className="relative inline-block whitespace-nowrap text-brand-800">
              <Word i={words.length}>de</Word> <Word i={words.length + 1}>verdade.</Word>
              <svg aria-hidden viewBox="0 0 300 18" preserveAspectRatio="none" className="hero-underline absolute -bottom-[0.12em] left-0 h-[0.16em] w-full">
                <path d="M0 4h300M0 14h190" stroke="var(--color-brand-900)" strokeWidth="5" fill="none" />
              </svg>
            </span>
          </h1>
          <p className="hero-in no-justify t-lead mt-8 max-w-[38ch] text-brand-950" style={{ ["--d" as string]: "380ms" }}>
            Você conta a sua situação. Uma pessoa da nossa equipe explica quais modalidades fazem sentido, com taxas e
            custos por escrito, antes de qualquer decisão.
          </p>
          <div className="hero-in mt-9 flex flex-col gap-3 xs:flex-row xs:items-center" style={{ ["--d" as string]: "520ms" }}>
            <Link href="/simulacao" className="btn btn-brand text-[1.05rem]" data-cta="hero_prequal">
              Iniciar pré-análise
              <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </Link>
            <a href="#perfil" className="btn btn-ghost text-brand-950">
              Descobrir minha modalidade
              <ArrowDown aria-hidden className="h-4 w-4" />
            </a>
          </div>
          <p className="hero-in t-small mt-6 flex items-center gap-2 font-semibold text-brand-950" style={{ ["--d" as string]: "640ms" }}>
            <span className="h-1.5 w-1.5 flex-none rounded-full bg-brand-900" aria-hidden />
            Sem compromisso: a pré-análise não é uma contratação.
          </p>
        </div>

        <div className="relative lg:col-span-5">
          {/* Arco do "C" recortando a fotografia */}
          <div className="relative mx-auto max-w-[520px] lg:mt-2">
            <div className="hero-photo rounded-[var(--radius-md)] rounded-tl-[42%]">
            <PhotoSlot
              priority
              tone="navy"
              src={photos.atendimento.src ?? undefined}
              alt={photos.atendimento.alt}
              brief={photos.atendimento.brief}
              className="aspect-[16/11] rounded-[var(--radius-md)] rounded-tl-[42%] sm:aspect-[4/3] lg:aspect-[4/5]"
            />
            </div>
            <CFPath className="pointer-events-none absolute -left-[38%] top-[8%] hidden w-[120%] opacity-90 lg:block" stroke="var(--color-brand-900)" animate weight={1.6} />
          </div>
        </div>
      </div>
    </section>
  );
}
