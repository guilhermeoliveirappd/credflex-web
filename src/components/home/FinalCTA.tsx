import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CFPath } from "@/components/brand/CFPath";
import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";

export function FinalCTA({
  title = "Quando fizer sentido para você, a gente conversa.",
  text = "Comece pela pré-análise. Leva poucos minutos, não tem compromisso e uma pessoa da equipe retorna com as possibilidades para o seu caso.",
  href = "/simulacao",
  label = "Iniciar pré-análise",
}: {
  title?: string;
  text?: string;
  href?: string;
  label?: string;
}) {
  return (
    <section aria-labelledby="cta-final-title" className="relative overflow-hidden bg-gold-400 py-[var(--section-y)] text-navy-950">
      <CFPath className="pointer-events-none absolute -right-[10%] top-1/2 hidden w-[60%] -translate-y-1/2 opacity-60 md:block" stroke="var(--color-navy-900)" weight={1.4} />
      <div className="container-x relative">
        <h2 id="cta-final-title" className="t-h1 max-w-[16ch]">
          {title}
        </h2>
        <p className="t-lead mt-6 max-w-[44ch] text-navy-900">{text}</p>
        <div className="mt-10 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
          <Link href={href} data-cta="final_prequal" className="btn btn-navy text-[1.05rem]">
            {label}
            <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
          </Link>
          <WhatsAppCTA location="final_cta" label="Falar no WhatsApp" className="text-navy-950" />
        </div>
      </div>
    </section>
  );
}
