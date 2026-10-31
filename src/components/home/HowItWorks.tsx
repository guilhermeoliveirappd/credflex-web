import { SectionHeading } from "@/components/ui/SectionHeading";

/** Etapas espelham exatamente o fluxo implementado em /simulacao. */
const steps = [
  {
    title: "Escolha o seu perfil",
    text: "Se não souber qual é, a gente ajuda.",
  },
  {
    title: "Responda poucas perguntas",
    text: "Só nome e WhatsApp para contato. Sem CPF.",
  },
  {
    title: "Fale com a equipe",
    text: "Uma pessoa retorna com as opções para o seu caso.",
  },
  {
    title: "Decida com a proposta em mãos",
    text: "A contratação depende da aprovação da instituição parceira.",
  },
];

export function HowItWorks({ tone = "accent" }: { tone?: "navy" | "accent" }) {
  const dark = tone === "navy";
  return (
    <section aria-labelledby="como-funciona-title" className={`${dark ? "noise bg-brand-900 text-white" : "bg-accent-400 text-brand-950"} overflow-hidden py-[var(--section-y)]`}>
      <div className="container-x">
        <SectionHeading
          id="como-funciona-title"
          tone={dark ? "light" : "dark"}
          title="Como funciona"
          className="max-w-3xl"
        />
        <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
          {/* conectores + itens animam separadamente: linha se desenha, etapas entram em sequência */}
          {/* O traço: linha que conecta as etapas, derivada das barras do F */}
          <span aria-hidden className={`absolute left-[19px] top-2 h-[calc(100%-1rem)] w-[2px] md:left-0 md:top-[19px] md:h-[2px] md:w-full ${dark ? "bg-white/15" : "bg-brand-900/20"}`} />
          <span aria-hidden data-reveal="line" className={`absolute left-[19px] top-2 h-[45%] w-[2px] md:left-0 md:top-[19px] md:h-[2px] md:w-[62%] ${dark ? "bg-accent-400" : "bg-brand-900"}`} />
          {steps.map((s, i) => (
            <li key={s.title} data-reveal="up" style={{ transitionDelay: `${i * 110}ms` }} className="relative grid grid-cols-[40px_1fr] gap-5 md:block">
              <span
                className={`t-num relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-[0.95rem] font-bold ${
                  i < 3 ? (dark ? "bg-accent-400 text-brand-950" : "bg-brand-900 text-white") : dark ? "border-2 border-white/30 bg-brand-900 text-white" : "border-2 border-brand-900/40 bg-accent-400 text-brand-950"
                }`}
              >
                {i + 1}
              </span>
              <div className="md:mt-8 md:pr-4">
                <h3 className={`text-[1.2rem] font-bold leading-snug ${dark ? "text-white" : "text-brand-950"}`}>{s.title}</h3>
                <p className={`mt-2 ${dark ? "text-brand-100" : "text-brand-950/85"}`}>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
